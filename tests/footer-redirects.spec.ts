import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "../fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { environment_url } from "configuration";

const FOOTER_LINKS_AND_ENDPOINTS_CSV =
		"ENG-1977-footer-links-and-endpoints.csv",
	footerRecords = parse_csv(DATASETS_DIR, FOOTER_LINKS_AND_ENDPOINTS_CSV) as {
		linkName: string;
		expectedURL: string;
	}[];

test.describe("Footer redirects tests", () => {
	test.use(storageStateNewUserAPI());

	footerRecords.forEach((record) => {
		test(`[ENG-1977] Footer - Verify '${record.linkName}' redirection from Footer section redirects to its respective page`, async ({
			homePage,
			footer,
		}) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder(record.linkName);
			await footer
				.assertThat()
				.verifyCurrentUrlIs(`${environment_url}${record.expectedURL}`);
		});
	});
});
