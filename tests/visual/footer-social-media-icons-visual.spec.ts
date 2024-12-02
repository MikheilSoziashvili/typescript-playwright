import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { test } from "@fixtures/fixtures";

const socialMedias = parse_csv(DATASETS_DIR, CsvFilesName.SOCIAL_MEDIAS) as {
	socialMedia: string;
}[];

test.describe("Visual Tests - Footer - social media icon", () => {
	socialMedias.forEach((record) => {
		test(`[ENG-2310] Social '${record.socialMedia}' media footer image is correct @visual`, async ({
			homePage,
			footer,
		}, testInfo) => {
			await homePage.navigateAndCheckTitle();
			await footer
				.assertThat()
				.footerSocialMediaIconVisualCorrect(
					testInfo,
					record.socialMedia,
				);
		});
	});

	test(`[ENG-2907] Verify social media icons order is correct @visual`, async ({
		homePage,
		footer,
	}, testInfo) => {
		await homePage.navigateAndCheckTitle();
		await footer
			.assertThat()
			.footerSocialMediaIconsBlockVisualCorrect(testInfo);
	});
});
