import { DK_PROXY_CREDENTIALS, ES_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CountryCodes } from "@enums/country-codes";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe(
	"User info tests",
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.USER_INFO)
		.apply(),
	() => {
		const userData = new RegisterTestData();

		test.use(
			storageStateNewUserDB({
				username: userData.username,
				password: userData.password,
				email: userData.email,
				emailVerified: true,
				userClass: UserClasses.Admin,
				tags: UserTags.UserInfoAdmin,
			}),
		);
		test("[ENG-5086] User info -  verify that last_country property is updated correctly", async ({
			userInfoAdminPage,
			infoAdminPage,
			softblockModal,
			browser,
		}) => {
			const context = await browser.newContext();
			const pages = {
				userInfoAdminPage,
				infoAdminPage,
				softblockModal,
			};
			const initialPage = await initializePageObjects(
				context,
				...Object.values(pages),
			);

			await initializePageObjectsWithCookies(
				await context.cookies(),
				initialPage,
				await createBrowserContextWithProxy(
					browser,
					DK_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

			await userInfoAdminPage.navigate();
			await softblockModal.steps().closeSoftblockModal();
			await userInfoAdminPage.steps().showUserDetails(userData.username);
			await infoAdminPage
				.assertThat()
				.lastCountryCodeCorrect(CountryCodes.DK);

			await initializePageObjectsWithCookies(
				await context.cookies(),
				initialPage,
				await createBrowserContextWithProxy(
					browser,
					ES_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

			await userInfoAdminPage.navigate();
			await softblockModal.steps().closeSoftblockModal();
			await userInfoAdminPage.steps().showUserDetails(userData.username);
			await infoAdminPage
				.assertThat()
				.lastCountryCodeCorrect(CountryCodes.ES);
		});
	},
);
