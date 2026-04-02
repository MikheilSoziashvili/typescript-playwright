import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";

test.describe("Wallet Country selector - Search field functionality", () => {
	const rows = testData().fromCsvRaw({
		file: CsvFilesName.WALLET_COUNTRY_SELECTOR_SEARCH,
	});

	for (const row of rows) {
		test(
			`[ENG-13584] Country selector search - ${row.search_queries}`,
			testDetails()
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(JiraComponent.WALLET)
				.apply(),
			async ({ browserSessionManager, homePage, walletModal }) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});

				await homePage.navigateToWallet();
				await walletModal.openCountrySelector();
				await walletModal.assertThat().countrySelectorDropdownIsOpen();
				await walletModal
					.steps()
					.searchCountryAndVerify(
						row.search_input,
						row.action,
						row.expected_state,
					);
			},
		);
	}
});
