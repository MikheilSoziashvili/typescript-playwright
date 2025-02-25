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

		test.beforeEach(async ({ homePage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.changeCurrency(record.currency);
		});
		test.use(storageStateNewUserAPI());

		test(`[ENG-4483] KOTH - visual in header with currency: ${record.currency} @visual`, async ({
			homePage,
		}, testInfo) => {
			await homePage.getKothCurrencyXPosition();
			await homePage.assertThat().kothInHeaderVisualCorrect(testInfo);
			await homePage.assertThat().verifyKothCurrencyIsCentered();
		});

		test(`[ENG-5179] KOTH - visual in dedicated page with currency: ${record.currency} @visual`, async ({
			kothPage,
		}, testInfo) => {
			await kothPage.navigate();
			await kothPage.getKothBannerCurrencyXPosition();
			await kothPage.assertThat().kothBannerVisualCorrect(testInfo);
			await kothPage.assertThat().verifyKothBannerCurrencyIsCentered();
			await kothPage.assertThat().verifyKothBannerTimerIsCentered();
		});
	});
});
