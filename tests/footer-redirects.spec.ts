import { DATASETS_DIR } from "@constants/file-paths";
import { KOTH_ENDPOINT } from "@constants/page-endpoints";
import { getCookieHeader, parse_csv } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { test } from "@fixtures/fixtures";
import { environment_url } from "configuration";
import { storageStateNewUserDB } from "../fixtures/auth-fixtures";
import { Timeout } from "@enums/timeout";

const footerRecords = parse_csv(
	DATASETS_DIR,
	CsvFilesName.FOOTER_LINKS_AND_ENDPOINTS,
) as {
	linkName: string;
	expectedURL: string;
}[];

const helpPageRecords = parse_csv(
	DATASETS_DIR,
	CsvFilesName.HELP_PAGE_FOOTER_LINKS_AND_REDIRECTS,
) as {
	infoPage: string;
	tabSelection: string;
}[];

const socialMediaRecords = parse_csv(
	DATASETS_DIR,
	CsvFilesName.SOCIAL_MEDIA_FOOTER_LINKS_AND_REDIRECTS,
) as {
	socialMedia: string;
	socialMediaUrlPart: string;
	gamdomUrlPart: string;
}[];

const officialSiteRecords = parse_csv(
	DATASETS_DIR,
	CsvFilesName.OFFICIAL_SITE_FOOTER_LINKS_AND_REDIRECTS,
) as {
	footerLink: string;
	expectedUrl: string;
}[];

const termsOfServiceRecords = parse_csv(
	DATASETS_DIR,
	CsvFilesName.TERMS_OF_SERVICE_TEXT,
) as {
	page: string;
	missingText: string;
}[];

const superAdminData = new RegisterTestData({
	useGamdomEmailDomain: true,
});

test.describe("Footer redirects tests", () => {
	test.use(storageStateNewUserDB());

	footerRecords.forEach((record) => {
		test(`[ENG-1977] Footer - Verify '${record.linkName}' redirection from Footer section redirects to its respective page`, async ({
			homePage,
			footer,
		}) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder(record.linkName);
			await footer
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(record.expectedURL);
		});
	});

	test(`[ENG-1977] Footer - Verify 'King Of The Hill' redirection from "Footer" section redirects to its respective page`, async ({
		homePage,
		footer,
		gamdomApi,
		kothPage,
		gamdomDb,
	}) => {
		await gamdomDb.createNewUser({
			username: superAdminData.username,
			password: superAdminData.password,
			email: superAdminData.email,
			tags: UserTags.SuperAdmin,
			userClass: UserClasses.Admin,
			emailVerified: true,
		});
		const superAdminCookie = getCookieHeader(
			await gamdomApi.authenticateWithExistingUser(
				superAdminData.username,
				superAdminData.password,
			),
		);
		await homePage.navigate();
		await footer.openFooterLinkByPlaceholder("King Of The Hill");

		await kothPage
			.assertThat()
			.verifyKothUrlIs(KOTH_ENDPOINT, gamdomApi, superAdminCookie);
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
			await footer
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(`${environment_url}/`);
			await homePage
				.assertThat()
				.verifyNewTabUrlParts([
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
		await footer.openLiveSupport();
		await liveSupportModal.assertThat().isDisplayed();
	});

	officialSiteRecords.forEach((record) => {
		test(`[ENG-1979] Footer - Verify '${record.footerLink}' link redirection from Footer`, async ({
			homePage,
			footer,
		}) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder(record.footerLink);
			await footer
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(`${environment_url}/`);
			await homePage.assertThat().verifyNewTabUrl(record.expectedUrl);
		});
	});

	termsOfServiceRecords.forEach((record) => {
		test(`[ENG-2557] Footer - Verify 'Terms of Service' text removal`, async ({
			homePage,
			helpPage,
			footer,
		}) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder("TOS");
			await helpPage
				.assertThat()
				.isHelpPageTitleVisible("Terms Of Service");
			await helpPage
				.assertThat()
				.isHelpPageTabSelected("Terms Of Service");
			await helpPage
				.assertThat()
				.isTextMissingInTermsOfServiceBlock(record.missingText);
		});
	});
});
