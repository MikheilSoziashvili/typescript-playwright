import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { isCI } from "configuration";

const socialMedias = parse_csv(DATASETS_DIR, CsvFilesName.SOCIAL_MEDIAS) as {
	socialMedia: string;
}[];

test.describe("Visual Tests - Footer - social media icon", () => {
	test.fixme(isCI);
	socialMedias.forEach((record) => {
		test(
			`[ENG-2310] Social '${record.socialMedia}' media footer image is correct`,
			testDetails()
				.withTags(TestTag.VISUAL, TestTag.LOCAL)
				.withJiraBugTickets("7253")
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
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
		testDetails()
			.withTags(TestTag.VISUAL, TestTag.LOCAL)
			.withArbitraryAnnotations({
				type: AnnotationType.BUG,
				description:
					"Due to issues on CI, maxDiffPixelRatio tolerance should be increased for footer visual tests.",
			})
			.withJiraBugTickets("7253")
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ homePage, footer }, testInfo) => {
			await homePage.navigateAndCheckTitle();
			await footer
				.assertThat()
				.footerSocialMediaIconsBlockVisualCorrect(testInfo);
		},
	);
});
