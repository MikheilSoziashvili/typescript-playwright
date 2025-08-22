import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";

const kothDataset = parse_csv(DATASETS_DIR, CsvFilesName.KOTH_VISUAL) as {
	currency: string;
}[];

kothDataset.forEach((record) => {
	test.describe("Visual Tests - KOTH", () => {
		test.slow();

		test.beforeEach(async ({ homePage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.authenticatedHeader.changeCurrency(record.currency);
		});
		test.use(storageStateNewUserDB());

		test(
			`[ENG-4483] KOTH - visual in header with currency: ${record.currency}`,
			testDetails().withTags(TestTag.VISUAL).apply(),
			async ({ homePage }, testInfo) => {
				await homePage.getKothCurrencyXPosition();
				await homePage.assertThat().kothInHeaderVisualCorrect(testInfo);
				await homePage.assertThat().verifyKothCurrencyIsCentered();
			},
		);

		test(
			`[ENG-5179] KOTH - visual in dedicated page with currency: ${record.currency}`,
			testDetails().withTags(TestTag.VISUAL).apply(),
			async ({ kothPage, homePage }, testInfo) => {
				await homePage.clickKothImage();
				await kothPage.getKothBannerCurrencyXPosition();
				await kothPage.assertThat().kothBannerVisualCorrect(testInfo);
				await kothPage
					.assertThat()
					.verifyKothBannerCurrencyIsCentered();
				await kothPage.assertThat().verifyKothBannerTimerIsCentered();
			},
		);
	});
});
