import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";

const kothDataset = parse_csv(DATASETS_DIR, CsvFilesName.KOTH_VISUAL) as {
	currency: string;
}[];

kothDataset.forEach((record) => {
	test.describe("Visual Tests - KOTH", () => {
		test.slow();
		test.use(storageStateNewUserAPI());

		test(`[ENG-4483] KOTH - visual in header with currency: ${record.currency} @visual`, async ({
			homePage,
		}, testInfo) => {
			await homePage.navigateAndCheckTitle();
			await homePage.changeCurrency(record.currency);
			await homePage.getKothCurrencyXPosition();
			await homePage.assertThat().kothInHeaderVisualCorrect(testInfo);
			await homePage.assertThat().verifyKothCurrencyIsCentered();
		});
	});
});
