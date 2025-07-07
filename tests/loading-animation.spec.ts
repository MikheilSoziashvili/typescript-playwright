import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import * as Configuration from "configuration";

const gamdomPages = parse_csv(DATASETS_DIR, CsvFilesName.LOADING_ANIMATION) as {
	linkName: string;
	URL: string;
}[];

test.describe("Loading animation tests", () => {
	test.use(storageStateNewSuperAdminUserDB());

	gamdomPages.forEach((record) => {
		test(`[ENG-2401] Loading animation for '${record.linkName}' should be correctly displayed on all pages`, async ({
			homePage,
		}) => {
			await homePage.navigate({
				link: `${Configuration.environment_url}${record.URL}`,
			});
			await homePage.assertThat().assertLoaderWasVisible();
			await homePage.assertThat().assertLoaderHasDisappeared();
			await homePage
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(record.URL);
		});
	});
});
