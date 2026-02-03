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
	"USD1 tests",
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
						cryptoName: CryptoTicker.USD1_SOL,
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
					.setMinDepositAndWithdraw(CryptoNode.fireUSD1_SOL);

				await homePage.navigate({
					cookies: { clearCookies: true },
				});

				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						amount: 150000,
					});

				await setAuthenticationCookies(page, cookie);
				await homePage.navigateToWallet();
				await walletModal.selectPaymentMethod(Cryptocurrency.USD1);
			},
		);

		test(
			"[ENG-14884] USD1_SOL - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usd1SolClient,
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
				await walletModal.selectDepositNetwork(CryptoTicker.USD1_SOL);

				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.usd1SolAmountToDeposit
						.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await usd1SolClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await usd1SolClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.USD1_SOL,
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

				const fullTransactionId = await usd1SolClient.getTransaction(
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
