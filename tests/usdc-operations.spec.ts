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

test.describe(
	"USDC tests",
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
					homePage,
					gamdomApiDbFacade,
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
						cryptoName: CryptoTicker.USDC_ETH,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDC_SOL,
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
					.setMinDepositAndWithdraw(CryptoNode.fireUSDC_ETH);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(CryptoNode.fireUSDC_SOL);

				await cryptoAdminPage.setUserPayWd(
					CryptoNode.fireUSDC_SOL,
					true,
				);

				await cryptoAdminPage.setUserPayWd(
					CryptoNode.fireUSDC_ETH,
					true,
				);

				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await homePage.navigate({
					cookies: { clearCookies: true },
				});

				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						amount: 150000,
					});

				await setAuthenticationCookies(page, cookie);
				await homePage.navigateToWallet();
				await walletModal.selectPaymentMethod(Cryptocurrency.USDC);
			},
		);

		test(
			"[ENG-10800] USDC_ETH - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdcEthClient,
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
				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await walletModal.selectDepositNetwork(CryptoTicker.USDC_ETH);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.usdcEthAmountToDeposit
						.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await usdcEthClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await usdcEthClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.USDC_ETH,
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

				const fullTransactionId = await usdcEthClient.getTransaction(
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
			"[ENG-10915] USDC_SOL - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdcSolClient,
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
				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await walletModal.selectDepositNetwork(CryptoTicker.USDC_SOL);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.usdcSolAmountToDeposit
						.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await usdcSolClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await usdcSolClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.USDC_SOL,
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

				const fullTransactionId = await usdcSolClient.getTransaction(
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
				`[ENG-13741] USDC_SOL - withdraw with vip user - ${speed.toLowerCase()}`,
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
					usdcSolClient,
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
						testDataPredefined.data.usdcSolAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDC_SOL
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(Cryptocurrency.USDC);

					await walletModal.selectDepositNetwork(
						CryptoTicker.USDC_SOL,
					);
					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction =
						await usdcSolClient.sendToAddress(
							vaultId,
							userDepositAddress,
							amountToDeposit,
						);

					await usdcSolClient.waitForCompletion(
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
						CryptoTicker.USDC_SOL,
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

					// Withdraw USDC_SOL
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.USDC,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						network: CryptoTicker.USDC_SOL,
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

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13744] USDC_ETH - withdraw with vip user - ${speed.toLowerCase()}`,
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
					usdcEthClient,
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
						testDataPredefined.data.usdcEthAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDC_ETH
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(Cryptocurrency.USDC);

					await walletModal.selectDepositNetwork(
						CryptoTicker.USDC_ETH,
					);
					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction =
						await usdcEthClient.sendToAddress(
							vaultId,
							userDepositAddress,
							amountToDepositLarger,
						);

					await usdcEthClient.waitForCompletion(
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
						CryptoTicker.USDC_ETH,
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
					// Withdraw USDC_ETH
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.USDC,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						network: CryptoTicker.USDC_ETH,
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

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-14308] USDC_SOL - withdraw with regular user - ${speed.toLowerCase()}`,
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
					usdcSolClient,
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
						testDataPredefined.data.usdcSolAmountToDeposit;
					const vaultId = fireblocks.vaultId;

					// Deposit USDC_SOL
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(Cryptocurrency.USDC);

					await walletModal.selectDepositNetwork(
						CryptoTicker.USDC_SOL,
					);
					const userDepositAddress =
						await walletModal.getDepositAddress();
					const depositTransaction =
						await usdcSolClient.sendToAddress(
							vaultId,
							userDepositAddress,
							amountToDepositLarger,
						);

					await usdcSolClient.waitForCompletion(
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
						CryptoTicker.USDC_SOL,
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

					// Withdraw USDC_SOL
					const withdrawalFee = await walletModal.withdrawCrypto({
						cryptocurrency: Cryptocurrency.USDC,
						address: withdrawalAddress,
						amount: amountToWithdraw,
						speed: speed,
						network: CryptoTicker.USDC_SOL,
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
							true,
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
					await setAuthenticationCookies(
						page,
						superAdminCookieHeader,
					);
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
