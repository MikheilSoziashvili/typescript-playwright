import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

test.describe("Wallet Country selector - Search field functionality", () => {
	const rows = testData().fromCsvRaw({
		file: CsvFilesName.WALLET_COUNTRY_SELECTOR_SEARCH,
	});

	for (const row of rows) {
		test(
			`[ENG-13584] Country selector search - ${row.search_queries}`,
			testDetails()
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(JiraComponent.WALLET, TestTag.ACCEPTANCE)
				.apply(),
			async ({ browserSessionManager }) => {
				const user = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{
						reuseContext: true,
					},
				);

				await user.pages.homePage.navigateToWallet();
				await user.pages.walletModal.openCountrySelector();
				await user.pages.walletModal
					.assertThat()
					.countrySelectorDropdownIsOpen();
				await user.pages.walletModal
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
