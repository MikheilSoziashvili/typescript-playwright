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

test.describe(
	"SOL tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		test.slow();
		test.beforeEach(
			async ({ cryptoAdminPage, page, gamdomApiDbFacade }, testInfo) => {
				const { cookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);
				await cryptoAdminPage.navigate();
				await cryptoAdminPage.toggleCryptoOperations([
					{
						cryptoName: Cryptocurrency.Solana,
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
						CryptoNode.fireSOL,
						CryptoTicker.SOL,
					);
			},
		);

		test(
			"[ENG-10303] SOL - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				solClient,
				gamdomApiDbFacade,
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
				const { cookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({
						emailVerified: true,
					});

				const superAdminCookie = getCookieHeader(cookie);

				await homePage.navigateToWallet();

				const initialBalanceCoins =
					await userBalanceHandler.walletBalanceInCoins(
						Unit.SOL_LAMPORT,
					);

				await walletModal.selectPaymentMethod(Cryptocurrency.Solana);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.solAmountToDeposit.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await solClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await solClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.SOL,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const expectedBalanceUSD = await userBalanceHandler
					.steps()
					.calculateExpectedBalanceAfterCryptoDeposit(
						initialBalanceCoins,
						amountToDeposit,
						Unit.SOL_LAMPORT,
					);

				const balanceAfterDepositUSD =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.SOL_LAMPORT,
					);

				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);

				const fullTransactionId = await solClient.getTransaction(
					depositTransaction.id,
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
