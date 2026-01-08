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
import { withdrawalSpeedToFeeLevel } from "@enums/withdrawal-speeds";
import { ToastTitle } from "@enums/toast-titles";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { TransactionType } from "@enums/transaction-types";
import { testData } from "test-data/test-data-manager";
import { VipUserStatus } from "@enums/vip-user-statuses";
import { logger } from "@logger/logger";

test.describe(
	"ETH tests",
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
						cryptoName: Cryptocurrency.Ethereum,
						deposit: true,
						withdraw: true,
					},
				]);

				await cryptoAdminPage.refreshCryptoData();
				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage.setUserPayWd(CryptoNode.fireETH, true);

				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireETH);
			},
		);

		test(
			"[ENG-10292] ETH - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				ethClient,
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
					await userBalanceHandler.walletBalanceInCoins(
						Unit.ETH_GWEI,
					);

				await walletModal.selectPaymentMethod(Cryptocurrency.Ethereum);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.ethAmountToDeposit.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await ethClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await ethClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.ETH,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const expectedBalanceUSD = await userBalanceHandler
					.steps()
					.calculateExpectedBalanceAfterCryptoDeposit(
						initialBalanceCoins,
						amountToDeposit,
						Unit.ETH_GWEI,
					);

				const balanceAfterDepositUSD =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.ETH_GWEI,
					);

				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);

				const fullTransactionId = await ethClient.getTransaction(
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
				`[ENG-11865] ETH - withdraw with regular user - ${speed.toLowerCase()}`,
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
					ethClient,
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
					await setAuthenticationCookies(page, cookie);

					const {
						withdrawalAddress,
						amountToWithdraw,
						amountToDeposit,
					} = testDataPredefined.data.ethAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit ETH
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Ethereum,
					);

					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction = await ethClient.sendToAddress(
						vaultId,
						userDepositAddress,
						amountToDeposit,
					);

					await ethClient.waitForCompletion(depositTransaction.id);
					await transactionsPage
						.steps()
						.verifyDepositTransactionStatusIs(
							TransactionState.COMPLETE,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Withdraw ETH
					await homePage.navigateToWallet();
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Ethereum,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
					});
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.ETH_GWEI,
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
					const superAdminCookie = getCookieHeader(superAdmin);
					const withdrawnAmountAfterFeeInCoins =
						userBalanceHandler.usdToCoinsTrunc(
							withdrawnAmountAfterFee,
						);

					await cryptoAdminPage
						.assertThat()
						.assertTransactionCoinsAmount(
							gamdomApi,
							superAdminCookie,
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

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-12053] ETH - withdraw with vip user - ${speed.toLowerCase()}`,
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
					ethClient,
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
					await gamdomDb.insertVipUser(
						user.userId,
						superAdmin.userId,
						VipUserStatus.BASIC_VIP,
					);
					await setAuthenticationCookies(page, cookie);

					const {
						withdrawalAddress,
						amountToWithdraw,
						amountToDeposit,
					} = testDataPredefined.data.ethAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit ETH
					await homePage.navigateToWallet();
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Ethereum,
					);

					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction = await ethClient.sendToAddress(
						vaultId,
						userDepositAddress,
						amountToDeposit,
					);

					await ethClient.waitForCompletion(depositTransaction.id);
					await transactionsPage
						.steps()
						.verifyDepositTransactionStatusIs(
							TransactionState.COMPLETE,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Withdraw ETH
					await homePage.navigateToWallet();

					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Ethereum,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						isVip: true,
					});
					logger.info(`Withdrawal fee: ${withdrawalFee}`);
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded(
							Unit.ETH_GWEI,
						);
					logger.info(`Initial balance USD: ${initialBalanceUSD}`);
					logger.info(
						`Balance after withdraw USD: ${balanceAfterWithdrawUSD}`,
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
						userBalanceHandler.usdToCoinsTrunc(
							withdrawnAmountAfterFee,
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
	},
);
