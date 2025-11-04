import { test } from "@fixtures/fixtures";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { CryptoNode } from "@enums/crypto-nodes";
import { TransactionState } from "@enums/transaction-states";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";

test.describe(
	"USDT tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		test.slow();
		test.beforeEach(
			async ({ cryptoAdminPage, page, gamdomApiDbFacade }, testInfo) => {
				const { cookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);
				await cryptoAdminPage.navigate();
				await cryptoAdminPage.toggleCryptoOperations({
					cryptoName: CryptoTicker.USDT,
					deposit: true,
					withdraw: true,
				});

				await cryptoAdminPage.refreshCryptoData();
				await cryptoAdminPage
					.steps()
					.waitUntilCryptoDataRefreshed(testInfo);

				await cryptoAdminPage
					.steps()
					.setMinDepositAndWithdraw(
						CryptoNode.nodeETH1,
						CryptoTicker.USDT,
					);
			},
		);

		test(
			"[ENG-10132] USDT - deposit via sepolia",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdtClient,
				gamdomApiDbFacade,
				cryptoAdminPage,
				homePage,
				walletModal,
				transactionsPage,
				transactionDetailsModal,
				userBalanceHandler,
				gamdomApi,
				page,
				testDataPredefined,
			}) => {
				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						amount: 150000,
					});

				await setAuthenticationCookies(page, cookie);

				const { cookie: adminCookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				const superAdminCookie = getCookieHeader(adminCookie);

				await homePage.navigateToWallet();

				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await walletModal.selectPaymentMethod(Cryptocurrency.Tether);
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
