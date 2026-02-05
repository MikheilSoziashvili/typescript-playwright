import { test } from "@fixtures/fixtures";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { ToastTitle } from "@enums/toast-titles";
import { TransactionType } from "@enums/transaction-types";
import { withdrawalSpeedToFeeLevel } from "@enums/withdrawal-speeds";
import { testData } from "test-data/test-data-manager";
import { VipUserStatus } from "@enums/vip-user-statuses";
import { Currency } from "@enums/currencies";
import { TestTag } from "@enums/test-tags";

test.describe(
	"USDT tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		const cryptoWithdrawalDomainData =
			testData().fromDomain().cryptoWithdrawal;
		test.slow();
		test.beforeEach(
			async (
				{
					cryptoAdminPage,
					browserSessionManager,
					gamdomApiDbFacade,
					homePage,
					walletModal,
					page,
				},
				testInfo,
			) => {
				await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
					reuseContext: true,
				});
				await cryptoAdminPage.navigate();
				await cryptoAdminPage.toggleCryptoOperations([
					{
						cryptoName: CryptoTicker.USDT,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDT_TRON,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDT_BSC,
						deposit: true,
						withdraw: true,
					},
				]);

				await cryptoAdminPage.refreshCryptoData();
				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage.setUserPayWd(CryptoNode.fireUSDT, {
					enabled: true,
				});

				await cryptoAdminPage.setUserPayWd(CryptoNode.fireTRX_USDT, {
					enabled: true,
				});

				await cryptoAdminPage.setUserPayWd(CryptoNode.fireUSDT_BSC, {
					enabled: true,
				});

				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireUSDT);
				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireTRX_USDT);
				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireUSDT_BSC);
				await homePage.navigate({
					cookies: { clearCookies: true },
				});

				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						amount: 150000,
					});

				await setAuthenticationCookies(page, cookie);
				await homePage.navigateToWallet();
				await walletModal.selectPaymentMethod(Cryptocurrency.Tether);
			},
		);

		test(
			"[ENG-10132] USDT_ETH - deposit via sepolia",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdtClient,
				cryptoAdminPage,
				homePage,
				walletModal,
				transactionsPage,
				transactionDetailsModal,
				userBalanceHandler,
				gamdomApi,
				testDataPredefined,
				browserSessionManager,
			}) => {
				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.usdtAmountToDeposit.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await usdtClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await usdtClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.USDT,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const balanceAfterDeposit =
					await userBalanceHandler.walletBalanceInFiatRounded();
				const expectedBalance =
					initialBalance + parseFloat(amountToDeposit);
				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDeposit, expectedBalance);

				const fullTransactionId = await usdtClient.getTransaction(
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

		test(
			"[ENG-10474] USDT_TRX - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdtTrxClient,
				cryptoAdminPage,
				homePage,
				walletModal,
				transactionsPage,
				transactionDetailsModal,
				userBalanceHandler,
				gamdomApi,
				testDataPredefined,
				browserSessionManager,
			}) => {
				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await walletModal.selectDepositNetwork(CryptoTicker.USDT_TRX);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.usdtTrxAmountToDeposit
						.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await usdtTrxClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await usdtTrxClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.USDT_TRX,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const balanceAfterDeposit =
					await userBalanceHandler.walletBalanceInFiatRounded();
				const expectedBalance =
					initialBalance + parseFloat(amountToDeposit);
				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDeposit, expectedBalance);

				const fullTransactionId = await usdtTrxClient.getTransaction(
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

		test(
			"[ENG-14995] USDT_BSC - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdtBscClient,
				cryptoAdminPage,
				homePage,
				walletModal,
				transactionsPage,
				transactionDetailsModal,
				userBalanceHandler,
				gamdomApi,
				testDataPredefined,
				browserSessionManager,
			}) => {
				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await walletModal.selectDepositNetwork(CryptoTicker.USDT_BSC);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.usdtBscAmountToDeposit
						.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await usdtBscClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await usdtBscClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.USDT_BSC,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const balanceAfterDeposit =
					await userBalanceHandler.walletBalanceInFiatRounded();
				const expectedBalance =
					initialBalance + parseFloat(amountToDeposit);
				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDeposit, expectedBalance);

				const fullTransactionId = await usdtBscClient.getTransaction(
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
				`[ENG-13331] USDT_ETH - withdraw with regular user - ${speed.toLowerCase()}`,
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
					usdtClient,
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

					const { withdrawalAddress, amountToDepositLarger } =
						testDataPredefined.data.usdtAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDT_ETH
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Tether,
					);

					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction = await usdtClient.sendToAddress(
						vaultId,
						userDepositAddress,
						amountToDepositLarger,
					);

					await usdtClient.waitForCompletion(depositTransaction.id);
					await transactionsPage
						.steps()
						.verifyDepositTransactionStatusIs(
							TransactionState.COMPLETE,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.USDT,
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

					// Withdraw USDT_ETH
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tether,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
					});
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

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
				`[ENG-13635] USDT_ETH - withdraw with vip user - ${speed.toLowerCase()}`,
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
					usdtClient,
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

					const { withdrawalAddress, amountToDepositLarger } =
						testDataPredefined.data.usdtAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDT_ETH
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Tether,
					);

					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction = await usdtClient.sendToAddress(
						vaultId,
						userDepositAddress,
						amountToDepositLarger,
					);

					await usdtClient.waitForCompletion(depositTransaction.id);

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
						CryptoTicker.USDT,
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
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Withdraw USDT_ETH
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tether,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						isVip: true,
					});

					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

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
				`[ENG-13482] USDT_TRX - withdraw with regular user - ${speed.toLowerCase()}`,
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
					usdtTrxClient,
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

					const { withdrawalAddress, amountToDepositLarger } =
						testDataPredefined.data.usdtTrxAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDT_TRX
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Tether,
					);

					await walletModal.selectDepositNetwork(
						CryptoTicker.USDT_TRX,
					);
					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction =
						await usdtTrxClient.sendToAddress(
							vaultId,
							userDepositAddress,
							amountToDepositLarger,
						);

					await usdtTrxClient.waitForCompletion(
						depositTransaction.id,
					);
					await transactionsPage
						.steps()
						.verifyDepositTransactionStatusIs(
							TransactionState.COMPLETE,
						);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.USDT_TRX,
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
					// Withdraw USDT_TRX
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tether,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						network: CryptoTicker.USDT_TRX,
					});
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					await homePage
						.assertThat()
						.verifyBalanceWithTolerance(
							balanceAfterWithdrawUSD,
							initialBalanceUSD -
								(amountToWithdraw - parseFloat(withdrawalFee)),
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
				`[ENG-13632] USDT_TRX - withdraw with vip user - ${speed.toLowerCase()}`,
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
					usdtTrxClient,
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
						testDataPredefined.data.usdtTrxAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDT_TRX
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Tether,
					);

					await walletModal.selectDepositNetwork(
						CryptoTicker.USDT_TRX,
					);
					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction =
						await usdtTrxClient.sendToAddress(
							vaultId,
							userDepositAddress,
							amountToDeposit,
						);

					await usdtTrxClient.waitForCompletion(
						depositTransaction.id,
					);
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
						CryptoTicker.USDT_TRX,
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
					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Withdraw USDT_TRX
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tether,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						network: CryptoTicker.USDT_TRX,
						isVip: true,
					});

					await toast.assertThat().titleIs(ToastTitle.SUCCESS);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

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
	},
);

test.describe(
	"USDT tests with custom fees",
	testDetails().withTags(TestTag.SEQUENTIAL, JiraComponent.CRYPTO).apply(),
	() => {
		const cryptoWithdrawalDomainData =
			testData().fromDomain().cryptoWithdrawal;
		test.slow();
		test.beforeEach(
			async (
				{ cryptoAdminPage, browserSessionManager, testDataPredefined },
				testInfo,
			) => {
				const { customLowFee, customMidFee } =
					testDataPredefined.data.usdtAmountToDeposit;

				await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
					reuseContext: true,
				});
				await cryptoAdminPage.navigate();
				await cryptoAdminPage.toggleCryptoOperations([
					{
						cryptoName: CryptoTicker.USDT,
						deposit: true,
						withdraw: true,
					},
				]);

				await cryptoAdminPage.refreshCryptoData();
				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage.setUserPayWd(CryptoNode.fireUSDT, {
					enabled: true,
					customFees: {
						lowFee: customLowFee,
						midFee: customMidFee,
					},
				});

				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireUSDT);
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-14706] USDT_ETH - withdraw with regular user and custom fees - ${speed.toLowerCase()}`,
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
				}) => {
					const { withdrawalAddress } =
						testDataPredefined.data.usdtAmountToDeposit;

					// Setup user
					const { user, cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							wagered: 100000,
						});
					const userCookie = getCookieHeader(cookie);
					await setAuthenticationCookies(page, cookie);

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.USDT,
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

					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Withdraw USDT_ETH and verify custom fee is applied
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tether,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						expectedCustomFee: feeInUsd,
					});

					await toast.assertThat().titleIs(ToastTitle.SUCCESS);
					await toast
						.assertThat()
						.titleIsNotDisplayed(ToastTitle.FAILED);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

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
				`[ENG-14775] USDT_ETH - withdraw with vip user and custom fees - ${speed.toLowerCase()}`,
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
					const { withdrawalAddress } =
						testDataPredefined.data.usdtAmountToDeposit;

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

					// Meet wager requirement
					await diceGamePage.navigate();
					await diceGamePage.rollDiceWithAmount(50);

					// Get withdrawal fee
					await homePage.navigateToWallet();
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.USDT,
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

					const initialBalanceUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

					// Withdraw USDT_ETH and verify custom fee is applied
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.Tether,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						expectedCustomFee: feeInUsd,
						isVip: true,
					});

					await toast.assertThat().titleIs(ToastTitle.SUCCESS);
					await toast
						.assertThat()
						.titleIsNotDisplayed(ToastTitle.FAILED);

					// Verify balance
					await homePage.navigate();
					const balanceAfterWithdrawUSD =
						await userBalanceHandler.walletBalanceInFiatRounded();

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
	},
);
