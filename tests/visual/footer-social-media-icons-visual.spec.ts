import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { test } from "@fixtures/fixtures";

const SOCIAL_MEDIAS_CSV = "ENG-2310-footer-social-media-icons.csv",
	socialMedias = parse_csv(DATASETS_DIR, SOCIAL_MEDIAS_CSV) as {
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
});
