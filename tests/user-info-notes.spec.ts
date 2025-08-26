import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("User info - notes", () => {
	const userData = new RegisterTestData();

	test.use(
		storageStateNewUserDB({
			username: userData.username,
			password: userData.password,
			email: userData.email,
		}),
	);

	test(
		"[ENG-6271] User info - notes",
		testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
		async ({
			gamdomApi,
			page,
			userInfoAdminPage,
			infoAdminPage,
			gamdomDb,
		}) => {
			const superAdminUserData = new RegisterTestData();
			await gamdomDb.createNewUser({
				username: superAdminUserData.username,
				password: superAdminUserData.password,
				email: superAdminUserData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
			});
			const superAdminCookie =
				await gamdomApi.authenticateWithExistingUser(
					superAdminUserData.username,
					superAdminUserData.password,
				);
			await setAuthenticationCookies(page, superAdminCookie);

			await userInfoAdminPage.navigate();
			await userInfoAdminPage.steps().showUserDetails(userData.username);

			const [, noteToPin, noteToSetInactive] = await infoAdminPage
				.steps()
				.createNote(3);
			await infoAdminPage.steps().pinNoteByText(noteToPin);
			await infoAdminPage.assertThat().noteIsPinned(noteToPin);

			await infoAdminPage
				.steps()
				.setNoteInactiveByText(noteToSetInactive);
			await infoAdminPage.assertThat().noteIsInactive(noteToSetInactive);

			await infoAdminPage.refresh();

			await infoAdminPage.assertThat().noteIsPinned(noteToPin);
		},
	);
});
