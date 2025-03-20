import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { waitBtcTransactionConfirmation } from "@core/helpers/asserter-helpers/crypto-asserters";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { Wallet } from "@enums/wallets";
import { CryptoNode } from "@enums/crypto-nodes";
import { Timeout } from "@enums/timeout";

test.describe("Bitcoin tests", () => {
	test.slow();
	test.describe.configure({ timeout: Timeout.SUPER_MAX });
	test.beforeEach(async ({ cryptoAdminPage, toast, page, gamdomApi }) => {
		const superAdminData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});
		const cookie = await gamdomApi.authenticateWithNewSuperAdminUser(
			superAdminData,
		);
		await setAuthenticationCookies(page, cookie);
		await cryptoAdminPage.navigate();
		await cryptoAdminPage.refreshCryptoData();
		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: ToastSubTitle.REFRESHED_STATE,
		});

		cryptoAdminPage.acceptDialog({
			expectedMessage: "Enter new minimum",
			inputText: "0.00001",
		});

		await cryptoAdminPage.clickMinDepositButton(CryptoNode.nodeBTC1);
	});

	test.use(storageStateNewUserAPI());
	test("BTC Deposit", async ({
		bitcoinApi,
		homePage,
		walletModal,
		transactionsPage,
		transactionDetailsModal,
		gamdomApi,
		cryptoAdminPage,
	}) => {
		const superAdminData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});

		await homePage.navigateToWallet();
		await walletModal.selectPaymentMethod(Cryptocurrency.Bitcoin);
		const userDepositAddress = await walletModal.getDepositAddress();
		const amountToSend = 0.00001;
		const feeRate = 50;

		const sendResponse = await bitcoinApi.sendBTC(
			userDepositAddress,
			amountToSend,
			{
				feeRate: feeRate,
				replaceable: false,
			},
		);

		const transactionId: string = sendResponse.result;
		await waitBtcTransactionConfirmation(bitcoinApi, transactionId);

		await transactionsPage.steps().verifyDepositTransactionIsComplete();
		await transactionsPage.openTransactionDetails();
		await transactionDetailsModal
			.assertThat()
			.assertDepositAmountInBTC(amountToSend);

		await homePage.navigate();
		await homePage.authenticatedHeader.clickBalanceDropdown();
		await homePage.authenticatedHeader
			.assertThat()
			.walletBalanceIs(Wallet.BTC, amountToSend);

		const adminCookie = getCookieHeader(
			await gamdomApi.authenticateWithNewSuperAdminUser(superAdminData),
		);
		await cryptoAdminPage
			.assertThat()
			.assertTransactionCryptoAmount(
				gamdomApi,
				adminCookie,
				transactionId,
				amountToSend,
			);
	});
});
