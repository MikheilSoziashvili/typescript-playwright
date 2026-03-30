import { testDetails } from "@core/helpers/test-details-helper";
import {
	getSessionIdFromCookie,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { HomePage } from "@pages/home-page/home-page";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Admin sessions tests",
	testDetails().withTags(JiraComponent.ADMIN_PANEL).apply(),
	() => {
		test(
			`[ENG-7575] [Admin][Sessions] Admin ends user's session`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				userInfoAdminPage,
				gamdomApiDbFacade,
				browser,
				page,
				userInfoSessionsAdminPage,
				toast,
			}) => {
				const { cookie: superAdminCookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({
						emailVerified: true,
					});
				const { user: regularUser, cookie: userCookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();

				const userSessionId = getSessionIdFromCookie(userCookie);
				await setAuthenticationCookies(page, superAdminCookie);
				const user2Context = await browser.newContext();
				const user2Page = await user2Context.newPage();
				await setAuthenticationCookies(user2Page, userCookie);

				const user2HomePage = new HomePage(user2Page);
				await user2HomePage.navigate();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(regularUser.username);
				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Sessions);
				await userInfoSessionsAdminPage.endSessionById(userSessionId);

				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.SESSION_ENDED);

				await user2HomePage.refresh();
				await user2HomePage.assertThat().userIsLoggedOut();
			},
		);
	},
);
