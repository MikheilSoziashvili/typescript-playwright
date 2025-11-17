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

test.describe(
	"USDT tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
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
				]);

				await cryptoAdminPage.refreshCryptoData();
				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(
						CryptoNode.fireUSDT,
						CryptoTicker.USDT,
					);
				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(
						CryptoNode.fireTRX_USDT,
						CryptoTicker.USDT_TRX,
					);
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

				await walletModal.selectUsdtNetwork(CryptoTicker.USDT_TRX);
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
	},
);
