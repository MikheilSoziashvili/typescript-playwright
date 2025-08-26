import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "../fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";

test.describe("Profile - verification", () => {
	test.use(storageStateNewUserDB());
	const removedRestrictedCountries = parse_csv(
		DATASETS_DIR,
		CsvFilesName.REMOVED_RESTRICTED_COUNTRIES,
	) as {
		restrictedCountries: string;
	}[];
	test(
		`[ENG-2625] Profile - Verification - Verify removed 'aml1RestrictedCountries' from KYC1 list`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({ verificationPage }) => {
			await verificationPage.navigate();
			await verificationPage.steps().expandCountryDropdown();
			await verificationPage
				.assertThat()
				.countryDropdownValuesNotContainsItems(
					removedRestrictedCountries.map(
						(country) => country.restrictedCountries,
					),
				);
		},
	);
});
