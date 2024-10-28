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

const HELP_PAGE_FOOTER_LINKS_AND_REDIRECTS_CSV =
		"ENG-1980-help-page-footer-links-and-redirects.csv",
	helpPageRecords = parse_csv(
		DATASETS_DIR,
		HELP_PAGE_FOOTER_LINKS_AND_REDIRECTS_CSV,
	) as {
		infoPage: string;
		tabSelection: string;
	}[];

const SOCIAL_MEDIA_FOOTER_LINKS_AND_REDIRECTS_CSV =
		"ENG-1981-footer-social-media-link-redirects.csv",
	socialMediaRecords = parse_csv(
		DATASETS_DIR,
		SOCIAL_MEDIA_FOOTER_LINKS_AND_REDIRECTS_CSV,
	) as {
		socialMedia: string;
		socialMediaUrlPart: string;
		gamdomUrlPart: string;
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

	helpPageRecords.forEach((record) => {
		test(`[ENG-1980] Footer - Verify correct page and tab selection is displayed after '${record.infoPage}' redirection from 'Info' and 'Support' sections footer links`, async ({
			homePage,
			footer,
			helpPage,
		}) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder(record.infoPage);
			await helpPage
				.assertThat()
				.isHelpPageTitleVisible(record.tabSelection);
			await helpPage
				.assertThat()
				.isHelpPageTabSelected(record.tabSelection);
		});
	});

	socialMediaRecords.forEach((record) => {
		test(`[ENG-1981] Footer - Verify Redirection from Footer to '${record.socialMedia}' Social Applications`, async ({
			homePage,
			footer,
		}) => {
			await homePage.navigate();
			await footer.openSocialMediaFooterLinkByPlaceholder(
				record.socialMedia,
			);
			await footer.assertThat().verifyCurrentUrlIs(`${environment_url}/`);
			await homePage
				.assertThat()
				.verifyNewTabUrl([
					`${record.socialMediaUrlPart}`,
					`${record.gamdomUrlPart}`,
				]);
		});
	});

	test(`[ENG-2826] Footer - Verify the Live Support modal is launched after redirection from Footer`, async ({
		homePage,
		footer,
		liveSupportModal,
	}) => {
		await homePage.navigate();
		await footer.openFooterLinkByPlaceholder("Live Support");
		await liveSupportModal.assertThat().isDisplayed();
	});
});
