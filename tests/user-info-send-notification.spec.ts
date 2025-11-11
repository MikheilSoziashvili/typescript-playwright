import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { NotificationsPage } from "@pages/notifications/notifications-page";
import { testData } from "test-data/test-data-manager";

const userInfoSendNotificationScenarios = testData().fromCsvParsed({
	file: CsvFilesName.USER_INFO_SEND_NOTIFICATION,
});

test.describe("User info - send notification tests", () => {
	for (const {
		user1Tag,
		user2Class,
		user2Tags,
		isEmailWithGamdomDomain,
	} of userInfoSendNotificationScenarios) {
		const user1 = new RegisterTestData();

		test.describe(`Verify sendning notifications with user1: ${user1Tag}, and receiving with user2 class: ${user2Class}${
			user2Tags ? `, user2 tag: ${user2Tags[0]}` : ""
		}`, () => {
			test.use(
				storageStateNewUserDB({
					username: user1.username,
					password: user1.password,
					email: user1.email,
					isEmailWithGamdomDomain: isEmailWithGamdomDomain,
					emailVerified: true,
					tags: user1Tag,
					userClass: UserClasses.Admin,
				}),
			);

			test(
				`[ENG-2808] UserInfo tab - verify the "Send notification" function`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({
					userInfoAdminPage,
					infoAdminPage,
					gamdomDb,
					gamdomApi,
					browser,
					testDataScenarios,
					testDataObject,
				}) => {
					const testDataScenario =
						testDataScenarios.notificationsTests;
					const user2 = testDataObject.register.random();
					await gamdomDb.createNewUser({
						username: user2.username,
						password: user2.password,
						email: user2.email,
						isEmailWithGamdomDomain: isEmailWithGamdomDomain,
						emailVerified: true,
						userClass: user2Class,
						...(user2Tags && { tags: user2Tags }),
					});

					const cookie = await gamdomApi.authenticateWithExistingUser(
						user2.username,
						user2.password,
					);
					const user2Context = await browser.newContext();
					const user2Page = await user2Context.newPage();
					await setAuthenticationCookies(user2Page, cookie);

					const user2NotificationsPage = new NotificationsPage(
						user2Page,
					);
					await user2NotificationsPage.navigate();

					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(user2.username);

					await infoAdminPage
						.steps()
						.sendNotification(
							testDataScenario.title,
							testDataScenario.description,
							testDataScenario.reason,
						);

					await user2NotificationsPage
						.getNotification()
						.assertThat()
						.titleIs(testDataScenario.title);
					await user2NotificationsPage
						.getNotification()
						.assertThat()
						.subTitleIs(testDataScenario.description);

					await user2NotificationsPage
						.assertThat()
						.notificationVisibleAndHasTitleAndDescription(
							testDataScenario.title,
							testDataScenario.description,
						);
				},
			);
		});
	}

	test.describe("User info - send long notification", () => {
		test(
			`[ENG-4852] UserInfo tab - verify the "Send long notification" function`,
			testDetails()
				.withTags(JiraComponent.NOTIFICATIONS)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({
				userInfoAdminPage,
				infoAdminPage,
				gamdomApiDbFacade,
				page,
				notifications,
				testDataPredefinedRandom,
			}) => {
				const { longTitle } =
					testDataPredefinedRandom.data.notifications;
				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						userClass: UserClasses.Admin,
						tags: UserTags.UserInfoAdmin,
					});
				await setAuthenticationCookies(page, cookie);

				await userInfoAdminPage.navigate();
				await userInfoAdminPage.searchForSteam64OrUserId(user.userId);
				await infoAdminPage.steps().sendNotification(longTitle);
				await notifications
					.assertThat()
					.looksCorrectForLongMessage(longTitle);
			},
		);
	});
});
