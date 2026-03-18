import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import * as Configuration from "configuration";
import { HomePage } from "@pages/home-page/home-page";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";

const gamdomPages = parse_csv(DATASETS_DIR, CsvFilesName.LOADING_ANIMATION) as {
	linkName: string;
	URL: string;
}[];

test.describe("Loading animation tests", () => {
	test.use(storageStateNewSuperAdminUserDB());

	gamdomPages.forEach((record) => {
		test(
			`[ENG-2401] Loading animation for '${record.linkName}' should be correctly displayed on all pages`,
			testDetails()
				.withTags(JiraComponent.GENERAL)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ homePage }) => {
				await homePage.navigate({
					link: `${Configuration.environment_url}${record.URL}`,
				});
				await homePage.assertThat().loaderIsCorrectlyDisplayed();
				await homePage
					.assertThat()
					.waitForAndVerifyCurrentUrlIs(record.URL);
			},
		);
	});
});

type AuthModalScenario = {
	name: string;
	openModal: (homePage: HomePage) => Promise<void>;
	assertVisible: (homePage: HomePage) => Promise<void>;
};

const getAuthenticationModalScenarios = (): AuthModalScenario[] => [
	{
		name: "Sign In",
		openModal: (homePage) =>
			homePage.unauthenticatedHeader.openLoginModal(),
		assertVisible: (homePage) =>
			homePage.loginModal.assertThat().loginModalElementsAreVisible(),
	},
	{
		name: "Create Account",
		openModal: (homePage) =>
			homePage.unauthenticatedHeader.openRegisterModal(),
		assertVisible: (homePage) =>
			homePage.registerModal
				.assertThat()
				.registerModalElementsAreVisible(),
	},
];

test.describe("Loading animation tests for authentication modals", () => {
	const modalScenarios = getAuthenticationModalScenarios();
	for (const scenario of modalScenarios) {
		test(
			`[ENG-2376] Loading animation appears when opening '${scenario.name}' modal`,
			testDetails()
				.withTags(JiraComponent.GENERAL)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ homePage }) => {
				await homePage.navigate();
				await scenario.openModal(homePage);
				await scenario.assertVisible(homePage);
				await homePage.assertThat().loaderIsCorrectlyDisplayed();
			},
		);
	}
});
