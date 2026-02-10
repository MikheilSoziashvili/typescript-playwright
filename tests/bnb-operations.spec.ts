import { test } from "@fixtures/fixtures";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { getCookieHeader } from "@core/utils/utils";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { Unit } from "@enums/units";
import { TestUserRole } from "@enums/test-user-roles";

test.describe(
	"BNB tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		test.slow();
		test.beforeEach(
			async ({ cryptoAdminPage, browserSessionManager }, testInfo) => {
				await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
					reuseContext: true,
				});
				await cryptoAdminPage.navigate();
				await cryptoAdminPage.toggleCryptoOperations([
					{
						cryptoName: Cryptocurrency.BNB,
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
					.setMinDepositAndWithdraw(CryptoNode.fireBNB);
			},
		);

		test(
			"[ENG-15125] BNB - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				bnbClient,
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
						Unit.BNB_JAGER,
					);

				await walletModal.selectPaymentMethod(Cryptocurrency.BNB);
				const userDepositAddress =
					await walletModal.getDepositAddress();
				const amountToDeposit =
					testDataPredefined.data.bnbAmountToDeposit.amountToDeposit;
				const vaultId = fireblocks.vaultId;

				const depositTransaction = await bnbClient.sendToAddress(
					vaultId,
					userDepositAddress,
					amountToDeposit,
				);

				await bnbClient.waitForCompletion(depositTransaction.id);

				await transactionsPage
					.steps()
					.verifyDepositTransactionStatusIs(
						TransactionState.COMPLETE,
					);
				await transactionsPage.clickTransactionDetailsButton();
				await transactionDetailsModal
					.assertThat()
					.assertDepositAmountIn(
						CryptoTicker.BNB,
						parseFloat(amountToDeposit),
					);

				await homePage.navigate();

				const expectedBalanceUSD = await userBalanceHandler
					.steps()
					.calculateExpectedBalanceAfterCryptoDeposit(
						initialBalanceCoins,
						amountToDeposit,
						Unit.BNB_JAGER,
					);

				const balanceAfterDepositUSD =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.BNB_JAGER,
					);

				await homePage
					.assertThat()
					.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);

				const fullTransactionId = await bnbClient.getTransaction(
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
