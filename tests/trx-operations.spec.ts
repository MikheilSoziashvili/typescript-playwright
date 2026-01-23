import { test } from "@fixtures/fixtures";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { Unit } from "@enums/units";
import { TestUserRole } from "@enums/test-user-roles";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { ToastTitle } from "@enums/toast-titles";
import { TransactionType } from "@enums/transaction-types";
import { VipUserStatus } from "@enums/vip-user-statuses";
import { withdrawalSpeedToFeeLevel } from "@enums/withdrawal-speeds";
import { testData } from "test-data/test-data-manager";
import { Currency } from "@enums/currencies";

test.describe(
	"TRX tests",
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
						cryptoName: Cryptocurrency.Tron,
						deposit: true,
						withdraw: true,
					},
				]);

				await cryptoAdminPage.refreshCryptoData();
				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage.setUserPayWd(CryptoNode.fireTRX, true);

				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireTRX);
			},
		);

		test(
			"[ENG-10325] TRX - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				trxClient,
				cryptoAdminPage,
				homePage,
				walletModal,
				transactionsPage,
				transactionDetailsModal,
				userBalanceHandler,
				gamdomApi,
				browserSessionManager,
				testDataPredefined,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});

				await homePage.navigateToWallet();

				const initialBalanceCoins =
					await userBalanceHandler.walletBalanceInCoins(Unit.TRX_SUN);

				await walletModal.selectPaymentMethod(Cryptocurrency.Tron);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.trxAmountToDeposit.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await trxClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await trxClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.TRX,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const expectedBalanceUSD = await userBalanceHandler
					.steps()
					.calculateExpectedBalanceAfterCryptoDeposit(
						initialBalanceCoins,
						amountToDeposit,
						Unit.TRX_SUN,
					);

				const balanceAfterDepositUSD =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.TRX_SUN,
					);

				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);

				const fullTransactionId = await trxClient.getTransaction(
					depositTransaction.id,
				);

				const superAdmin = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
				);

				const superAdminCookie = getCookieHeader(
					superAdmin.getAuthenticatedUser().cookie,
				);
				await cryptoAdminPage
					.assertThat()
					.assertTransactionCryptoAmount(
						gamdomApi,
						superAdminCookie,
						fullTransactionId.txHash,
						parseFloat(amountToDeposit),
					);
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13475] TRX - withdraw with vip user - ${speed.toLowerCase()}`,
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
					trxClient,
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

					const { withdrawalAddress, amountToDeposit } =
						testDataPredefined.data.trxAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit TRX
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();
					await walletModal.selectPaymentMethod(Cryptocurrency.Tron);

					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction = await trxClient.sendToAddress(
						vaultId,
						userDepositAddress,
						amountToDeposit,
					);

					await trxClient.waitForCompletion(depositTransaction.id);
					await transactionsPage
						.steps()
						.verifyDepositTransactionStatusIs(
							TransactionState.COMPLETE,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.TRX,
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
					// Withdraw TRX
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tron,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						isVip: true,
					});

					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.TRX_SUN,
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
				`[ENG-13724] TRX - withdraw with regular user - ${speed.toLowerCase()}`,
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
					trxClient,
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

					const { withdrawalAddress, amountToDeposit } =
						testDataPredefined.data.trxAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit TRX
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();
					await walletModal.selectPaymentMethod(Cryptocurrency.Tron);

					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction = await trxClient.sendToAddress(
						vaultId,
						userDepositAddress,
						amountToDeposit,
					);

					await trxClient.waitForCompletion(depositTransaction.id);
					await transactionsPage
						.steps()
						.verifyDepositTransactionStatusIs(
							TransactionState.COMPLETE,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.TRX,
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
					// Withdraw TRX
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tron,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						isVip: false,
					});

					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.TRX_SUN,
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
					const superAdminCookieHeader = getCookieHeader(superAdmin);
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
	},
);
