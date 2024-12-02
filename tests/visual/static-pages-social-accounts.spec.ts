import { DATASETS_DIR } from "@constants/file-paths";
import { SocialMediaRecord } from "@core/types/types";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { test } from "@fixtures/fixtures";
import { BannedUserPage } from "@pages/banned-user/banned-user-page";
import { GeoblockedPage } from "@pages/geoblocked/geoblocked-page";
import { MaintenancePage } from "@pages/maintenance/maintenance-page";

const SOCIAL_MEDIA_FILE_NAMES = {
	banned: CsvFilesName.BANNED_SOCIAL_ACCOUNTS,
	maintenance: CsvFilesName.MAINTENANCE_SOCIAL_ACCOUNTS,
	geoblocked: CsvFilesName.GEOBLOCKED_SOCIAL_ACCOUNTS,
} as const;

const socialMediaRecordsList: SocialMediaRecord[][] = Object.values(
	SOCIAL_MEDIA_FILE_NAMES,
).map((fileName) => parse_csv(DATASETS_DIR, fileName)) as SocialMediaRecord[][];

const [
	bannedPageSocialMedias,
	maintenancePageSocialMedias,
	geoblockedPageSocialMedias,
] = socialMediaRecordsList;

test.describe("Static pages - social accounts", () => {
	Object.entries({
		banned: bannedPageSocialMedias,
		geoblocked: geoblockedPageSocialMedias,
		maintenance: maintenancePageSocialMedias,
	}).forEach(([pageType, socialMediaList]) => {
		const typedPageType = pageType as keyof typeof SOCIAL_MEDIA_FILE_NAMES;
		socialMediaList.forEach((socialMedia) => {
			test(`[ENG-2480] Verify '${socialMedia.social_account}' social account in '${socialMedia.static_page}' static page @visual`, async ({
				homePage,
				bannedUserPage,
				geoblockedPage,
				maintenancePage,
			}, testInfo) => {
				const pageObjects: Record<
					keyof typeof SOCIAL_MEDIA_FILE_NAMES,
					BannedUserPage | GeoblockedPage | MaintenancePage
				> = {
					banned: bannedUserPage,
					geoblocked: geoblockedPage,
					maintenance: maintenancePage,
				};

				const pageObject = pageObjects[typedPageType];

				await pageObject.navigateToPage(socialMedia.static_page);
				await pageObject
					.assertThat()
					.footerSocialMediaIconVisualCorrect(
						testInfo,
						socialMedia.locator,
					);
				await pageObject
					.assertThat()
					.isSocialMediaLinkCorrect(
						socialMedia.locator,
						socialMedia.external_url,
					);
				await pageObject.openSocialMediaFooterLinkByPlaceholder(
					socialMedia.locator,
				);
				await homePage
					.assertThat()
					.verifyNewTabUrl([
						`${socialMedia.socialMedia_UrlPart}`,
						`${socialMedia.gamdom_UrlPart}`,
					]);
			});
		});
	});
});
