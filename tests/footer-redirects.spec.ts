import { DATASETS_DIR } from "@constants/file-paths";
import { KOTH_ENDPOINT } from "@constants/page-endpoints";
import {
	getCookieHeader,
	maskHeadlessUserAgent,
	parse_csv,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { test } from "@fixtures/fixtures";
import { environment_url } from "configuration";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { testData } from "test-data/test-data-manager";
import { Timeout } from "@enums/timeout";

const footerRecords = testData().fromCsvRaw({
	file: CsvFilesName.FOOTER_LINKS_AND_ENDPOINTS,
});

const footerRecordsLoggedOut = testData().fromCsvParsed({
	file: CsvFilesName.FOOTER_LINKS_AND_ENDPOINTS,
});

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

const loggedState = [
	{
		state: "User logged in flow",
		user: true,
		csv: footerRecords,
	},
	{
		state: "User logged out flow",
		user: false,
		csv: footerRecordsLoggedOut,
	},
];
loggedState.forEach(({ state, user, csv }) => {
	test.describe(
		`Footer redirects tests - ${state}`,
		testDetails().withTags(JiraComponent.FOOTER).apply(),
		() => {
			test.beforeEach(async ({ page, gamdomApiDbFacade }) => {
				if (user) {
					const { cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth();
					await setAuthenticationCookies(page, cookie);
				}
			});
			csv.forEach((record) => {
				test(
					`[ENG-1977] Footer - Verify '${record.linkName}' redirection from Footer section redirects to its respective page - ${state}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ homePage, footer }) => {
						await homePage.navigate();
						await footer.openFooterLinkByPlaceholder(
							record.linkName,
						);
						await footer
							.assertThat()
							.waitForAndVerifyCurrentUrlIs(
								record.expectedURL,
								false,
								Timeout.EXTRA_LONG,
							);
					},
				);
			});

			test(
				`[ENG-1977] Footer - Verify 'King Of The Hill' redirection from "Footer" section redirects to its respective page - ${state}`,
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
				async ({
					homePage,
					footer,
					gamdomApi,
					kothPage,
					gamdomApiDbFacade,
				}) => {
					const { cookie } =
						await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
					const superAdminCookie = getCookieHeader(cookie);

					await homePage.navigate();
					await footer.openFooterLinkByPlaceholder(
						"King Of The Hill",
					);

					await kothPage
						.assertThat()
						.verifyKothUrlIs(
							KOTH_ENDPOINT,
							gamdomApi,
							superAdminCookie,
						);
				},
			);

			helpPageRecords.forEach((record) => {
				test(
					`[ENG-1980] Footer - Verify correct page and tab selection is displayed after '${record.infoPage}' redirection from 'Info' and 'Support' sections footer links - ${state}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ homePage, footer, helpPage }) => {
						await homePage.navigate();
						await footer.openFooterLinkByPlaceholder(
							record.infoPage,
						);
						await helpPage
							.assertThat()
							.isHelpPageTitleVisible(record.tabSelection);
						await helpPage
							.assertThat()
							.isHelpPageTabSelected(record.tabSelection);
					},
				);
			});

			socialMediaRecords.forEach((record) => {
				test(
					`[ENG-1981] Footer - Verify Redirection from Footer to '${record.socialMedia}' Social Applications - ${state}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ homePage, footer }) => {
						await homePage.navigate();
						await footer.openSocialMediaFooterLinkByPlaceholder(
							record.socialMedia,
						);
						await footer
							.assertThat()
							.waitForAndVerifyCurrentUrlIs(
								`${environment_url}/`,
							);
						await homePage
							.assertThat()
							.verifyNewTabUrlParts([
								`${record.socialMediaUrlPart}`,
								`${record.gamdomUrlPart}`,
							]);
					},
				);
			});

			test(
				`[ENG-2826] Footer - Verify the Live Support modal is launched after redirection from Footer - ${state}`,
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
				async ({ homePage, footer, liveSupportModal, page }) => {
					await maskHeadlessUserAgent(page);
					await homePage.navigate();
					await footer.assertThat().footerIsVisible();
					await footer.openLiveSupport();
					await liveSupportModal.assertThat().isDisplayed();
				},
			);

			officialSiteRecords.forEach((record) => {
				test(
					`[ENG-1979] Footer - Verify '${record.footerLink}' link redirection from Footer - ${state}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ homePage, footer }) => {
						await homePage.navigate();
						await footer.openFooterLinkByPlaceholder(
							record.footerLink,
						);
						await footer
							.assertThat()
							.waitForAndVerifyCurrentUrlIs(
								`${environment_url}/`,
							);
						await homePage
							.assertThat()
							.verifyNewTabUrl(record.expectedUrl);
					},
				);
			});

			termsOfServiceRecords.forEach((record) => {
				test(
					`[ENG-2557] Footer - Verify 'Terms of Service' text removal  - ${state}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ homePage, helpPage, footer }) => {
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
							.isTextMissingInTermsOfServiceBlock(
								record.missingText,
							);
					},
				);
			});
		},
	);
});
