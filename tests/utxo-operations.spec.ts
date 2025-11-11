import { test } from "@fixtures/fixtures";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { waitUtxoTransactionConfirmation } from "@core/helpers/asserter-helpers/crypto-asserters";
import { ToastTitle } from "@enums/toast-titles";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { Wallet } from "@enums/wallets";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { testnetAddress } from "@constants/crypto";
import { Timeout } from "@enums/timeout";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";
import { testDetails } from "@core/helpers/test-details-helper";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";

test.describe("UTXO tests", () => {
	test.slow();
	test.beforeEach(
		async ({ cryptoAdminPage, page, gamdomApi, gamdomDb }, testInfo) => {
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
			await cryptoAdminPage.toggleCryptoOperations([
				{
					cryptoName: Cryptocurrency.Bitcoin,
					deposit: true,
					withdraw: true,
				},
				{
					cryptoName: Cryptocurrency.Litecoin,
					deposit: true,
					withdraw: true,
				},
			]);

			await cryptoAdminPage.refreshCryptoData();

			await cryptoAdminPage
				.steps()
				.waitUntilCryptoDataRefreshed(testInfo);

			await cryptoAdminPage
				.steps()
				.setMinDepositAndWithdraw(
					CryptoNode.nodeBTC1,
					CryptoTicker.BTC,
				);
			await cryptoAdminPage
				.steps()
				.setMinDepositAndWithdraw(
					CryptoNode.nodeLTC1,
					CryptoTicker.LTC,
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
		async (
			{
				gamdomApiDbFacade,
				btcClient,
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
			},
			testInfo,
		) => {
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

			const sendResponse = await btcClient.sendToAddress(
				userDepositAddress,
				amountToDeposit,
				{
					feeRate: feeRate,
					replaceable: false,
				},
			);

			const transactionId: string = sendResponse.result;
			await waitUtxoTransactionConfirmation(
				btcClient,
				transactionId,
				testInfo,
			);

			await transactionsPage
				.steps()
				.verifyDepositTransactionStatusIs(TransactionState.COMPLETE);
			await transactionsPage.clickTransactionDetailsButton();
			await transactionDetailsModal
				.assertThat()
				.assertDepositAmountIn(CryptoTicker.BTC, amountToDeposit);

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

			await waitUtxoTransactionConfirmation(
				btcClient,
				withdrawTransactionId,
				testInfo,
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

	test(
		"[ENG-10267] LTC - deposit",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
		async (
			{
				gamdomApiDbFacade,
				ltcClient,
				homePage,
				walletModal,
				transactionsPage,
				transactionDetailsModal,
				gamdomApi,
				cryptoAdminPage,
				browserSessionManager,
				testDataPredefined,
			},
			testInfo,
		) => {
			await browserSessionManager.loginAs(TestUserRole.REGULAR, {
				reuseContext: true,
			});
			const { cookie } =
				await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({
					emailVerified: true,
				});

			const superAdminCookie = getCookieHeader(cookie);

			await homePage.navigateToWallet();
			const addressDetails =
				await walletModal.selectCryptoAndGetDepositDetails(
					Cryptocurrency.Litecoin,
				);
			const amountToDeposit =
				testDataPredefined.data.ltcAmountToDeposit.amountToDeposit;

			const sendResponse = await ltcClient.sendToAddress(
				addressDetails.address,
				amountToDeposit,
				{
					replaceable: false,
				},
			);

			const transactionId: string = sendResponse.result;
			await waitUtxoTransactionConfirmation(
				ltcClient,
				transactionId,
				testInfo,
			);

			await transactionsPage
				.steps()
				.verifyDepositTransactionStatusIs(TransactionState.COMPLETE);
			await transactionsPage.clickTransactionDetailsButton();
			await transactionDetailsModal
				.assertThat()
				.assertDepositAmountIn(CryptoTicker.LTC, amountToDeposit);

			await homePage.navigate();
			await homePage.authenticatedHeader.clickBalanceDropdown();
			await homePage.authenticatedHeader
				.assertThat()
				.walletBalanceIs(Wallet.LTC, amountToDeposit);

			await cryptoAdminPage
				.assertThat()
				.assertTransactionCryptoAmount(
					gamdomApi,
					superAdminCookie,
					transactionId,
					amountToDeposit,
				);
		},
	);
});
