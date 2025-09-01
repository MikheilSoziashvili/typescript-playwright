import { test } from "@fixtures/fixtures";
import { waitBtcTransactionConfirmation } from "@core/helpers/asserter-helpers/crypto-asserters";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	getCookieHeader,
	setAuthenticationCookies,
	waitUntil,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { Wallet } from "@enums/wallets";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { testnetAddress } from "@constants/crypto";
import { Timeout } from "@enums/timeout";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { testDetails } from "@core/helpers/test-details-helper";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { JiraUser } from "@enums/jira/jira-users";
import { TransactionType } from "@enums/transaction-types";

test.describe("Bitcoin tests", () => {
	test.slow();
	test.beforeEach(
		async ({ cryptoAdminPage, toast, page, gamdomApi, gamdomDb }) => {
			const superAdminData = new RegisterTestData({
				useGamdomEmailDomain: true,
			});
			await gamdomDb.createNewUser({
				username: superAdminData.username,
				password: superAdminData.password,
				email: superAdminData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
				emailVerified: true,
			});
			const superadminCookie =
				await gamdomApi.authenticateWithExistingUser(
					superAdminData.username,
					superAdminData.password,
				);
			await setAuthenticationCookies(page, superadminCookie);
			await cryptoAdminPage.navigate();
			await cryptoAdminPage.toggleCryptoOperations({
				cryptoName: Cryptocurrency.Bitcoin,
				deposit: true,
				withdraw: true,
			});

			await cryptoAdminPage.refreshCryptoData();

			await waitUntil(
				async () => {
					try {
						await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
							subTitle: ToastSubTitle.REFRESHED_STATE,
						});
						return true;
					} catch {
						return false;
					}
				},
				{
					errorMessage: "Crypto data table couldn't load in time",
					intervalSeconds: TimeoutSeconds.TWO,
					timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
				},
			);
			await cryptoAdminPage
				.steps()
				.setDepositOrWithdrawMin(
					TransactionType.DEPOSIT,
					CryptoNode.nodeBTC1,
					"0.00001",
				);

			await cryptoAdminPage
				.steps()
				.setDepositOrWithdrawMin(
					TransactionType.WITHDRAWAL,
					CryptoNode.nodeBTC1,
					"0.00001",
				);
		},
	);

	test.setTimeout(Timeout.EXTRA_MAX + Timeout.SUPER_MAX);
	test(
		"[ENG-5450] BTC - deposit and withdraw",
		testDetails()
			.withArbitraryAnnotations({
				type: AnnotationType.INFRASTRUCTURE,
				description: "Rate limit issues",
			})
			.withAuthor(JiraUser.ANGEL_PETROV)
			.apply(),
		async ({
			gamdomApiDbFacade,
			bitcoinApi,
			gamdomDb,
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
			const { cookie } =
				await gamdomApiDbFacade.createSingleUserDbAndAuth();

			await setAuthenticationCookies(page, cookie);

			const superAdminData = new RegisterTestData({
				useGamdomEmailDomain: true,
			});

			const userCookie = cookie;

			await gamdomDb.createNewUser({
				username: superAdminData.username,
				password: superAdminData.password,
				email: superAdminData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
				emailVerified: true,
			});
			const adminCookie = getCookieHeader(
				await gamdomApi.authenticateWithExistingUser(
					superAdminData.username,
					superAdminData.password,
				),
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

			await waitBtcTransactionConfirmation(
				bitcoinApi,
				withdrawTransactionId,
			);
			await transactionsPage
				.steps()
				.verifyWithdrawTransactionStatusIs(TransactionState.CONFIRMED);

			await homePage.navigate();
			await homePage.authenticatedHeader.clickBalanceDropdown();
			await homePage.authenticatedHeader
				.assertThat()
				.walletBalanceIs(
					Wallet.BTC,
					amountToDeposit - amountToWithdraw,
				);

			const adminApiCookie = getCookieHeader(adminCookie);
			await cryptoAdminPage
				.assertThat()
				.assertTransactionCryptoAmount(
					gamdomApi,
					adminApiCookie,
					withdrawTransactionId,
					amountToWithdraw,
				);
		},
	);
});
