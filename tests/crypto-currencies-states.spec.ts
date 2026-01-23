import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe("Crypto currencies states tests", () => {
	test.slow();

	testData()
		.fromCsvParsed({
			file: CsvFilesName.ENABLE_DISABLE_CRYPTO_CURRENCIES_STATUSES,
		})
		.forEach((record) => {
			test(
				`[ENG-10584] Enable/Disable crypto currencies - ${record.cryptoTicker} (Deposit: ${record.isDepositEnabled}, Withdrawal: ${record.isWithdrawalEnabled})`,
				testDetails()
					.withTags(
						TestTag.SEQUENTIAL,
						JiraComponent.CRYPTO,
						JiraComponent.ADMIN_PANEL,
					)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({
					browserSessionManager,
					cryptoAdminPage,
					walletModal,
					homePage,
				}) => {
					await browserSessionManager.loginAs(
						TestUserRole.ADMIN_CRYPTOSUPADMIN,
						{
							reuseContext: true,
						},
					);
					await cryptoAdminPage.navigate();
					await cryptoAdminPage.toggleCryptoOperations(
						record.cryptoCurrencies.map((crypto) => ({
							cryptoName: crypto,
							deposit: record.isDepositEnabled,
							withdraw: record.isWithdrawalEnabled,
						})),
					);

					await homePage.navigateToWallet();
					await walletModal
						.steps()
						.openWithdrawTabAndVerifyCryptoCurrencyPresence(
							record.cryptoTicker,
							record.isWithdrawalEnabled,
						);
					await walletModal
						.steps()
						.openDepositTabAndVerifyCryptoCurrencyPresence(
							record.cryptoTicker,
							record.isDepositEnabled,
						);

					await cryptoAdminPage
						.steps()
						.waitForCryptoProcessingIfNeeded(record.cryptoTicker);
					await cryptoAdminPage.navigate();
					await cryptoAdminPage
						.assertThat()
						.cryptoOperationsToggleStatus(
							record.cryptoCurrencies.map((crypto) => ({
								cryptoName: crypto,
								deposit: record.isDepositEnabled,
								withdraw: record.isWithdrawalEnabled,
							})),
						);
				},
			);
		});
});
