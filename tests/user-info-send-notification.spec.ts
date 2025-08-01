import { setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { NotificationsPage } from "@pages/notifications/notifications-page";
import { testData } from "test-data/test-data-manager";

const userInfoSendNotificationScenarios = testData().fromCsvParsed({
	file: CsvFilesName.USER_INFO_SEND_NOTIFICATION,
});

const title = "testTitle";
const description = "testDescription";
const reason = "testReason";

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

			test(`[ENG-2808] UserInfo tab - verify the "Send notification" function`, async ({
				userInfoAdminPage,
				infoAdminPage,
				gamdomDb,
				gamdomApi,
				browser,
			}) => {
				const user2 = new RegisterTestData();
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

				const user2NotificationsPage = new NotificationsPage(user2Page);
				await user2NotificationsPage.navigate();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(user2.username);

				await infoAdminPage
					.steps()
					.sendNotification(title, description, reason);

				await user2NotificationsPage
					.getNotification()
					.assertThat()
					.titleIs(title);
				await user2NotificationsPage
					.getNotification()
					.assertThat()
					.subTitleIs(description);

				await user2NotificationsPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						title,
						description,
					);
			});
		});
	}
});
