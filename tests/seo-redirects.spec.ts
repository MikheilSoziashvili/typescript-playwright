import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "../fixtures/auth-fixtures";
import { generateRandomString, getCookieHeader } from "@core/utils/utils";
import { HttpStatus } from "@enums/http-status";
import {
	ESPORTS_REDIRECT_FROM,
	ESPORTS_REDIRECT_TO,
} from "../constants/seo-redirects";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";

test.describe("SEO Redirects tests", () => {
	test.describe("SEO Redirects - create, edit, delete and check history", () => {
		test.use(storageStateNewSuperAdminUserDB());

		const EMPTY_INITIAL_PATH = "";
		let fromPath: string;
		let toPath: string;
		let fromPathEdited: string;
		let toPathEdited: string;

		test.beforeEach(async ({ seoRedirectsAdminPage, newRedirectModal }) => {
			fromPath = generateRandomString({
				prefix: "auto_",
				length: 7,
			});
			toPath = generateRandomString({
				prefix: "auto_",
				length: 7,
			});
			fromPathEdited = generateRandomString({
				prefix: "auto_edited_",
				length: 7,
			});
			toPathEdited = generateRandomString({
				prefix: "auto_edited_",
				length: 7,
			});
			await seoRedirectsAdminPage.navigate();
			await seoRedirectsAdminPage.clickNewRedirectButton();
			await newRedirectModal.assertThat().newRedirectModalIsDisplayed();
			await newRedirectModal.steps().createNewRedirect(fromPath, toPath);
		});

		test(
			"[ENG-5620] Create a new redirect",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ seoRedirectsAdminPage }) => {
				await seoRedirectsAdminPage
					.assertThat()
					.verifyRedirectIsVisible(fromPath);
				await seoRedirectsAdminPage
					.steps()
					.openHistoryAndVerifyEdit(
						EMPTY_INITIAL_PATH,
						fromPath,
						EMPTY_INITIAL_PATH,
						toPath,
					);
			},
		);

		test(
			"[ENG-5622] Edit an existing redirect",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ seoRedirectsAdminPage, newRedirectModal }) => {
				await seoRedirectsAdminPage.clickEditRedirect(fromPath);
				await newRedirectModal
					.steps()
					.editRedirect(fromPathEdited, toPathEdited);
				await seoRedirectsAdminPage
					.assertThat()
					.verifyRedirectIsVisible(fromPathEdited);
				await seoRedirectsAdminPage
					.steps()
					.openHistoryAndVerifyEdit(
						fromPath,
						fromPathEdited,
						toPath,
						toPathEdited,
					);
			},
		);

		test(
			"[ENG-5622] Delete a redirect",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ seoRedirectsAdminPage }) => {
				await seoRedirectsAdminPage
					.assertThat()
					.verifyRedirectIsVisible(fromPath);
				await seoRedirectsAdminPage
					.steps()
					.deleteRedirectAndAssertToast(fromPath);

				await seoRedirectsAdminPage
					.steps()
					.openHistoryAndVerifyEdit(
						fromPath,
						EMPTY_INITIAL_PATH,
						toPath,
						EMPTY_INITIAL_PATH,
					);
			},
		);
	});

	test.describe("SEO Redirects - functional", () => {
		const fromPath = "/blog/esports-10";
		const toPath = "/bg-BG/blog/esports-10";

		test(
			"[ENG-5620] Verify redirect functionality",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ gamdomApiDbFacade, blogPostPage, gamdomApi }) => {
				const { user: superAdminUser } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				const superAdminCookie = getCookieHeader(
					await gamdomApi.authenticateWithExistingUser(
						superAdminUser.username,
						superAdminUser.password,
					),
				);
				await gamdomApi.ensureRedirectExists(
					fromPath,
					toPath,
					superAdminCookie,
				);
				await blogPostPage.navigateToBlogPost(fromPath);
				await blogPostPage
					.assertThat()
					.waitForAndVerifyCurrentUrlIs(`${toPath}`);
			},
		);
	});

	test.describe("SEO Redirects - public URL redirects", () => {
		test(
			"[ENG-6190] - /esports redirects to /sports/esports with 301 status",
			testDetails()
				.withTags(JiraComponent.SPORTS_ESPORTS_BETTING, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ gamdomApi, gamdomApiAsserter }) => {
				const response = await gamdomApi.getPublicRedirectResponse(
					ESPORTS_REDIRECT_FROM,
				);
				await gamdomApiAsserter.assertPublicRedirect(
					response,
					HttpStatus.MOVED_PERMANENTLY,
					ESPORTS_REDIRECT_TO,
				);
			},
		);
	});
});
