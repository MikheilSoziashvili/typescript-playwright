import { test } from "@fixtures/fixtures";
import { waitBtcTransactionConfirmation } from "@core/helpers/asserter-helpers/crypto-asserters";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { Wallet } from "@enums/wallets";
import { CryptoNode } from "@enums/crypto-nodes";
import { Timeout } from "@enums/timeout";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { TransactionState } from "@enums/transaction-states";
import { testnetAddress } from "@constants/crypto";

test.describe("Bitcoin tests", () => {
	test.slow();
	test.describe.configure({ timeout: Timeout.SUPER_MAX + Timeout.EXTRA_MAX });
	test.beforeEach(async ({ cryptoAdminPage, toast, page, gamdomApi }) => {
		const superAdminData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});
		const superadminCookie =
			await gamdomApi.authenticateWithNewSuperAdminUser(superAdminData);
		await setAuthenticationCookies(page, superadminCookie);
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
		await cryptoAdminPage.clickMinWithdrawButton(CryptoNode.nodeBTC1);

		const userCookie = await gamdomApi.authenticateWithExistingUser(
			userData.username,
			userData.password,
		);
		await setAuthenticationCookies(page, userCookie);
	});

	const userData = new RegisterTestData();

	test.use(
		storageStateNewUserAPI({
			username: userData.username,
			password: userData.password,
		}),
	);
	test("[ENG-5450] BTC - deposit and withdraw", async ({
		bitcoinApi,
		homePage,
		walletModal,
		transactionsPage,
		transactionDetailsModal,
		gamdomApi,
		cryptoAdminPage,
		diceGamePage,
		page,
		toast,
	}) => {
		const superAdminData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});
		const userCookie = await gamdomApi.authenticateWithExistingUser(
			userData.username,
			userData.password,
		);
		const adminCookie = getCookieHeader(
			await gamdomApi.authenticateWithNewSuperAdminUser(superAdminData),
		);

		await homePage.navigateToWallet();
		await walletModal.selectPaymentMethod(Cryptocurrency.Bitcoin);
		const userDepositAddress = await walletModal.getDepositAddress();
		const amountToDeposit = 0.00004;
		const amountToWithdraw = 0.00002;
		const feeRate = 50;

		const sendResponse = await bitcoinApi.sendBTC(
			userDepositAddress,
			amountToDeposit,
			{
				feeRate: feeRate,
				replaceable: false,
			},
		);

		const transactionId: string = sendResponse.result;
		await waitBtcTransactionConfirmation(bitcoinApi, transactionId);

		await transactionsPage
			.steps()
			.verifyDepositTransactionStatusIs(TransactionState.COMPLETE);
		await transactionsPage.clickTransactionDetailsButton();
		await transactionDetailsModal
			.assertThat()
			.assertDepositAmountInBTC(amountToDeposit);

		await homePage.navigate();
		await homePage.authenticatedHeader.clickBalanceDropdown();
		await homePage.authenticatedHeader
			.assertThat()
			.walletBalanceIs(Wallet.BTC, amountToDeposit);

		await cryptoAdminPage
			.assertThat()
			.assertTransactionCryptoAmount(
				gamdomApi,
				adminCookie,
				transactionId,
				amountToDeposit,
			);

		await diceGamePage.navigate();
		await diceGamePage.rollDiceWithAmount(50);

		await homePage.authenticatedHeader.changeWallet(Wallet.BTC);
		await homePage.navigateToWallet();
		await walletModal.withdrawBtc(testnetAddress, amountToWithdraw);
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);

		await setAuthenticationCookies(page, adminCookie);
		await cryptoAdminPage.sendQueuedWithdrawals();

		await setAuthenticationCookies(page, userCookie);
		await transactionsPage
			.steps()
			.verifyWithdrawTransactionStatusIs(TransactionState.SENT);
		await transactionsPage.clickTransactionDetailsButton();

		const withdrawTransactionId =
			await transactionDetailsModal.getBlockchainTransactionId();

		await waitBtcTransactionConfirmation(bitcoinApi, withdrawTransactionId);
		await transactionsPage
			.steps()
			.verifyWithdrawTransactionStatusIs(TransactionState.CONFIRMED);

		await homePage.navigate();
		await homePage.authenticatedHeader.clickBalanceDropdown();
		await homePage.authenticatedHeader
			.assertThat()
			.walletBalanceIs(Wallet.BTC, amountToDeposit - amountToWithdraw);

		const adminApiCookie = getCookieHeader(adminCookie);
		await cryptoAdminPage
			.assertThat()
			.assertTransactionCryptoAmount(
				gamdomApi,
				adminApiCookie,
				withdrawTransactionId,
				amountToWithdraw,
			);
	});
});
