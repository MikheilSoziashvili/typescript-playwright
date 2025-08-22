import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { isCI } from "configuration";

const socialMedias = parse_csv(DATASETS_DIR, CsvFilesName.SOCIAL_MEDIAS) as {
	socialMedia: string;
}[];

test.describe("Visual Tests - Footer - social media icon", () => {
	test.fixme(
		isCI,
		"Skip on CI due to https://gamdom.atlassian.net/browse/ENG-7253. Skip will be removed after ENG-7253 is fixed",
	);
	socialMedias.forEach((record) => {
		test(
			`[ENG-2310] Social '${record.socialMedia}' media footer image is correct`,
			testDetails().withTags(TestTag.VISUAL).apply(),
			async ({ homePage, footer }, testInfo) => {
				await homePage.navigateAndCheckTitle();
				// Expected screenshots ratio is 40 x 40 pxs
				await footer
					.assertThat()
					.footerSocialMediaIconVisualCorrect(
						testInfo,
						record.socialMedia,
					);
			},
		);
	});

	test(
		`[ENG-2907] Verify social media icons order is correct`,
		testDetails().withTags(TestTag.VISUAL).apply(),
		async ({ homePage, footer }, testInfo) => {
			await homePage.navigateAndCheckTitle();
			await footer
				.assertThat()
				.footerSocialMediaIconsBlockVisualCorrect(testInfo);
		},
	);
});
