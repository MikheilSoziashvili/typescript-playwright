import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { NotificationsPage } from "@pages/notifications/notifications-page";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";

test.describe(
	"Bulk Actions - Notifications",
	testDetails().withTags(JiraComponent.ADMIN).apply(),
	() => {
		test.use(storageStateNewSuperAdminUserDB());
		test(
			`[ENG-7577] Check the bulk upload functionality for sending notifications`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApiDbFacade,
				bulkActionsAdminPage,
				gamdomApi,
				browser,
			}) => {
				const [userOneData, userTwoData] =
					await gamdomApiDbFacade.createUsersDb({
						usersCount: 2,
					});

				const validUserIds = [
					userOneData.userId.toString(),
					userTwoData.userId.toString(),
				];
				const invalidUserIds = ["0", "-1"];
				const allUserIds = [...validUserIds, ...invalidUserIds];

				await bulkActionsAdminPage.navigateAndGoToNotificationsTab();

				const title = generateRandomString({
					prefix: "AutoTestTitle",
					length: 5,
				});
				const description = generateRandomString({
					prefix: "AutoTestDescription",
					length: 10,
				});

				await bulkActionsAdminPage
					.steps()
					.sendNotificationToMultipleUsers(
						allUserIds,
						title,
						description,
					);

				await bulkActionsAdminPage
					.assertThat()
					.successLogsContainUserIds(validUserIds);

				await bulkActionsAdminPage
					.assertThat()
					.errorLogsContainUserIds(invalidUserIds);

				const cookieUserOne =
					await gamdomApi.authenticateWithExistingUser(
						userOneData.username,
						userOneData.password,
					);

				const userOneContext = await browser.newContext();
				const userOnePage = await userOneContext.newPage();

				await setAuthenticationCookies(userOnePage, cookieUserOne);

				const userOneNotificationsPage = new NotificationsPage(
					userOnePage,
				);
				await userOneNotificationsPage.navigate();
				await userOneNotificationsPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						title,
						description,
					);

				const cookieUserTwo =
					await gamdomApi.authenticateWithExistingUser(
						userTwoData.username,
						userTwoData.password,
					);

				const userTwoContext = await browser.newContext();
				const userTwoPage = await userTwoContext.newPage();
				await setAuthenticationCookies(userTwoPage, cookieUserTwo);

				const userTwoNotificationsPage = new NotificationsPage(
					userTwoPage,
				);
				await userTwoNotificationsPage.navigate();
				await userTwoNotificationsPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						title,
						description,
					);
			},
		);
	},
);
