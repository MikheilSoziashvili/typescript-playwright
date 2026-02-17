import { test } from "@fixtures/fixtures";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { waitUtxoTransactionConfirmation } from "@core/helpers/asserter-helpers/crypto-asserters";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { Timeout } from "@enums/timeout";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { Unit } from "@enums/units";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { ToastTitle } from "@enums/toast-titles";
import { TransactionType } from "@enums/transaction-types";
import { withdrawalSpeedToFeeLevel } from "@enums/withdrawal-speeds";
import { testData } from "test-data/test-data-manager";
import { JiraComponent } from "@enums/jira/jira-components";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Currency } from "@enums/currencies";
import { VipUserStatus } from "@enums/vip-user-statuses";

test.describe(
	"UTXO tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		const cryptoWithdrawalDomainData =
			testData().fromDomain().cryptoWithdrawal;
		test.slow();
		test.beforeEach(
			async ({ cryptoAdminPage, browserSessionManager }, testInfo) => {
				await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
					reuseContext: true,
				});
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
					.setMinDepositAndWithdraw(CryptoNode.nodeBTC1);
				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.nodeLTC1);

				await cryptoAdminPage.setUserPayWd(CryptoNode.nodeBTC1, {
					enabled: true,
				});
				/*
				Uncomment when LTC wallet is topped up
				await cryptoAdminPage.setUserPayWd(CryptoNode.nodeLTC1, {
					enabled: true,
				});
				*/

				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);
			},
		);

		test.setTimeout(Timeout.EXTRA_MAX + Timeout.SUPER_MAX);
		test(
			"[ENG-13639] BTC - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async (
				{
					gamdomApiDbFacade,
					btcClient,
					homePage,
					browserSessionManager,
					walletModal,
					transactionsPage,
					transactionDetailsModal,
					gamdomApi,
					cryptoAdminPage,
					userBalanceHandler,
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

				const initialBalanceCoins =
					await userBalanceHandler.walletBalanceInCoins(
						Unit.BTC_SATOSHI,
					);

				const addressDetails =
					await walletModal.selectCryptoAndGetDepositDetails(
						Cryptocurrency.Bitcoin,
					);
				const { feeRate, amountToDeposit } =
					testDataPredefined.data.btcAmountToDeposit;

				const sendResponse = await btcClient.sendToAddress(
					addressDetails.address,
					amountToDeposit,
					{
						replaceable: false,
						feeRate: feeRate,
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
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(CryptoTicker.BTC, amountToDeposit);

				await homePage.navigate();

				const expectedBalanceUSD = await userBalanceHandler
					.steps()
					.calculateExpectedBalanceAfterCryptoDeposit(
						initialBalanceCoins,
						amountToDeposit,
						Unit.BTC_SATOSHI,
					);

				const balanceAfterDepositUSD =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.BTC_SATOSHI,
					);

				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);

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
					userBalanceHandler,
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

				const initialBalanceCoins =
					await userBalanceHandler.walletBalanceInCoins(
						Unit.LTC_LITOSHI,
					);

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
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(CryptoTicker.LTC, amountToDeposit);

				await homePage.navigate();

				const expectedBalanceUSD = await userBalanceHandler
					.steps()
					.calculateExpectedBalanceAfterCryptoDeposit(
						initialBalanceCoins,
						amountToDeposit,
						Unit.LTC_LITOSHI,
					);

				const balanceAfterDepositUSD =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.LTC_LITOSHI,
					);

				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);

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

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13640] BTC - withdraw with regular user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({
					cryptoAdminPage,
					homePage,
					walletModal,
					transactionsPage,
					transactionDetailsModal,
					userBalanceHandler,
					gamdomApi,
					testDataPredefined,
					gamdomApiDbFacade,
					page,
					toast,
					diceGamePage,
					userInfoAdminPage,
					transactionsAdminPage,
				}) => {
					// Setup user and test data
					const { user, cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							wagered: 100000,
						});
					const userCookie = getCookieHeader(cookie);
					await setAuthenticationCookies(page, cookie);

					// Deposit BTC
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					const addressDetails =
						await walletModal.selectCryptoAndGetDepositDetails(
							Cryptocurrency.Bitcoin,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.BTC,
						{ cookie: userCookie },
					);
					const feeInCoins =
						fees[withdrawalSpeedToFeeLevel[speed]].totalFeeInCoins;
					const feeInUsd =
						await userBalanceHandler.coinsToFiatRounded(
							feeInCoins,
							Currency.USD,
						);
					const amountToWithdraw =
						feeInUsd +
						testDataPredefined.data.amountTolerance
							.amountToleranceUsd;

					// Withdraw BTC
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Bitcoin,
						address: addressDetails.address,
						amount: amountToWithdraw,
						speed: speed,
					});
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.BTC_SATOSHI,
						);
					await homePage
						.assertThat()
						.verifyBalanceWithTolerance(
							balanceAfterWithdrawUSD,
							initialBalanceUSD - amountToWithdraw,
						);

					const withdrawnAmountAfterFee =
						amountToWithdraw - parseFloat(withdrawalFee);

					// Process withdrawal as superadmin
					const { cookie: superAdmin } =
						await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
					await setAuthenticationCookies(page, superAdmin);
					await cryptoAdminPage.sendQueuedWithdrawals();

					// Verify withdrawal transaction flow
					await setAuthenticationCookies(page, cookie);
					await transactionsPage
						.steps()
						.verifyWithdrawTransactionStatusIs(
							TransactionState.SENT,
						);

					await transactionsPage
						.steps()
						.verifyWithdrawTransactionStatusIs(
							TransactionState.CONFIRMED,
							TimeoutSeconds.THREE_HUNDRED,
						);

					// Verify transaction details
					await transactionsPage.clickTransactionDetailsButton();
					await transactionDetailsModal
						.assertThat()
						.withdrawalTransactionDetailsAre(
							withdrawnAmountAfterFee,
							withdrawalFee,
							false,
							speed,
						);

					const withdrawTransactionId =
						await transactionDetailsModal.getBlockchainTransactionId();

					// Verify admin panel shows correct amounts
					const superAdminCookie = getCookieHeader(superAdmin);
					const withdrawnAmountAfterFeeInCoins =
						userBalanceHandler.usdToCoinsNetAfterFeeTrunc(
							amountToWithdraw,
							parseFloat(withdrawalFee),
						);

					await cryptoAdminPage
						.assertThat()
						.assertTransactionCoinsAmount(
							gamdomApi,
							superAdminCookie,
							withdrawTransactionId,
							withdrawnAmountAfterFeeInCoins,
							TransactionType.WITHDRAWAL,
						);

					// Verify user info transactions tab as superadmin
					await setAuthenticationCookies(page, superAdmin);
					const expectedFeeLevel = withdrawalSpeedToFeeLevel[speed];

					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(user.username);
					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.Transactions,
					);
					await transactionsAdminPage
						.steps()
						.fetchDataForRecordWithBalanceAndVerifyFeeLevel(
							TransactionType.WITHDRAWAL,
							expectedFeeLevel,
						);
				},
			);
		}

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-14322] BTC - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({
					cryptoAdminPage,
					homePage,
					walletModal,
					transactionsPage,
					transactionDetailsModal,
					userBalanceHandler,
					gamdomApi,
					testDataPredefined,
					gamdomApiDbFacade,
					page,
					toast,
					diceGamePage,
					userInfoAdminPage,
					transactionsAdminPage,
					gamdomDb,
				}) => {
					// Setup user and test data
					const { cookie: superAdminCookie, user: superAdmin } =
						await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
					const { user, cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							wagered: 100000,
						});
					const userCookie = getCookieHeader(cookie);
					await gamdomDb.insertVipUser(
						user.userId,
						superAdmin.userId,
						VipUserStatus.BASIC_VIP,
					);
					await setAuthenticationCookies(page, cookie);

					// Deposit BTC
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					const addressDetails =
						await walletModal.selectCryptoAndGetDepositDetails(
							Cryptocurrency.Bitcoin,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.BTC,
						{ cookie: userCookie },
					);
					const feeInCoins =
						fees[withdrawalSpeedToFeeLevel[speed]].totalFeeInCoins;
					const feeInUsd =
						await userBalanceHandler.coinsToFiatRounded(
							feeInCoins,
							Currency.USD,
						);
					const amountToWithdraw =
						feeInUsd +
						testDataPredefined.data.amountTolerance
							.amountToleranceUsd;

					// Withdraw BTC
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Bitcoin,
						address: addressDetails.address,
						amount: amountToWithdraw,
						speed: speed,
						isVip: true,
					});
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.BTC_SATOSHI,
						);
					await homePage
						.assertThat()
						.verifyBalanceWithTolerance(
							balanceAfterWithdrawUSD,
							initialBalanceUSD - amountToWithdraw,
						);

					const withdrawnAmountAfterFee =
						amountToWithdraw - parseFloat(withdrawalFee);

					// Process withdrawal as superadmin
					await setAuthenticationCookies(page, superAdminCookie);
					await cryptoAdminPage.sendQueuedWithdrawals();

					// Verify withdrawal transaction flow
					await setAuthenticationCookies(page, cookie);
					await transactionsPage
						.steps()
						.verifyWithdrawTransactionStatusIs(
							TransactionState.SENT,
						);

					await transactionsPage
						.steps()
						.verifyWithdrawTransactionStatusIs(
							TransactionState.CONFIRMED,
							TimeoutSeconds.THREE_HUNDRED,
						);

					// Verify transaction details
					await transactionsPage.clickTransactionDetailsButton();
					await transactionDetailsModal
						.assertThat()
						.withdrawalTransactionDetailsAre(
							withdrawnAmountAfterFee,
							withdrawalFee,
							true,
							speed,
						);

					const withdrawTransactionId =
						await transactionDetailsModal.getBlockchainTransactionId();

					// Verify admin panel shows correct amounts
					const superAdminCookieHeader =
						getCookieHeader(superAdminCookie);
					const withdrawnAmountAfterFeeInCoins =
						userBalanceHandler.usdToCoinsNetAfterFeeTrunc(
							amountToWithdraw,
							parseFloat(withdrawalFee),
						);

					await cryptoAdminPage
						.assertThat()
						.assertTransactionCoinsAmount(
							gamdomApi,
							superAdminCookieHeader,
							withdrawTransactionId,
							withdrawnAmountAfterFeeInCoins,
							TransactionType.WITHDRAWAL,
						);

					// Verify user info transactions tab as superadmin
					await setAuthenticationCookies(page, superAdminCookie);
					const expectedFeeLevel = withdrawalSpeedToFeeLevel[speed];

					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(user.username);
					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.Transactions,
					);
					await transactionsAdminPage
						.steps()
						.fetchDataForRecordWithBalanceAndVerifyFeeLevel(
							TransactionType.WITHDRAWAL,
							expectedFeeLevel,
						);
				},
			);
		}

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-14323] LTC - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({
					cryptoAdminPage,
					homePage,
					walletModal,
					transactionsPage,
					transactionDetailsModal,
					userBalanceHandler,
					gamdomApi,
					testDataPredefined,
					gamdomApiDbFacade,
					page,
					toast,
					diceGamePage,
					userInfoAdminPage,
					transactionsAdminPage,
					gamdomDb,
				}) => {
					test.fixme(
						true,
						"Temporary skipped until LTC wallet is toped up",
					);
					// Setup user and test data
					const { cookie: superAdminCookie, user: superAdmin } =
						await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
					const { user, cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							wagered: 100000,
						});
					const userCookie = getCookieHeader(cookie);
					await gamdomDb.insertVipUser(
						user.userId,
						superAdmin.userId,
						VipUserStatus.BASIC_VIP,
					);
					await setAuthenticationCookies(page, cookie);

					const { withdrawalAddress } =
						testDataPredefined.data.ltcAmountToDeposit;

					// Deposit LTC
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.LTC,
						{ cookie: userCookie },
					);
					const feeInCoins =
						fees[withdrawalSpeedToFeeLevel[speed]].totalFeeInCoins;
					const feeInUsd =
						await userBalanceHandler.coinsToFiatRounded(
							feeInCoins,
							Currency.USD,
						);
					const amountToWithdraw =
						feeInUsd +
						testDataPredefined.data.amountTolerance
							.amountToleranceUsd;

					// Withdraw LTC
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Litecoin,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						isVip: true,
					});
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);
					await toast
						.assertThat()
						.titleIsNotDisplayed(ToastTitle.FAILED);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.LTC_LITOSHI,
						);
					await homePage
						.assertThat()
						.verifyBalanceWithTolerance(
							balanceAfterWithdrawUSD,
							initialBalanceUSD - amountToWithdraw,
						);

					const withdrawnAmountAfterFee =
						amountToWithdraw - parseFloat(withdrawalFee);

					// Process withdrawal as superadmin
					await setAuthenticationCookies(page, superAdminCookie);
					await cryptoAdminPage.sendQueuedWithdrawals();

					// Verify withdrawal transaction flow
					await setAuthenticationCookies(page, cookie);
					await transactionsPage
						.steps()
						.verifyWithdrawTransactionStatusIs(
							TransactionState.SENT,
						);

					await transactionsPage
						.steps()
						.verifyWithdrawTransactionStatusIs(
							TransactionState.CONFIRMED,
							TimeoutSeconds.THREE_HUNDRED,
						);

					// Verify transaction details
					await transactionsPage.clickTransactionDetailsButton();
					await transactionDetailsModal
						.assertThat()
						.withdrawalTransactionDetailsAre(
							withdrawnAmountAfterFee,
							withdrawalFee,
							true,
							speed,
						);

					const withdrawTransactionId =
						await transactionDetailsModal.getBlockchainTransactionId();

					// Verify admin panel shows correct amounts
					const superAdminCookieHeader =
						getCookieHeader(superAdminCookie);
					const withdrawnAmountAfterFeeInCoins =
						userBalanceHandler.usdToCoinsNetAfterFeeTrunc(
							amountToWithdraw,
							parseFloat(withdrawalFee),
						);

					await cryptoAdminPage
						.assertThat()
						.assertTransactionCoinsAmount(
							gamdomApi,
							superAdminCookieHeader,
							withdrawTransactionId,
							withdrawnAmountAfterFeeInCoins,
							TransactionType.WITHDRAWAL,
						);

					// Verify user info transactions tab as superadmin
					await setAuthenticationCookies(page, superAdminCookie);
					const expectedFeeLevel = withdrawalSpeedToFeeLevel[speed];

					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(user.username);
					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.Transactions,
					);
					await transactionsAdminPage
						.steps()
						.fetchDataForRecordWithBalanceAndVerifyFeeLevel(
							TransactionType.WITHDRAWAL,
							expectedFeeLevel,
						);
				},
			);
		}
	},
);
