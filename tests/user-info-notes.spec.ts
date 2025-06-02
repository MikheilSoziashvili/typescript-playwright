import { setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import {
	storageStateNewSuperAdminUserDB,
	storageStateNewUserDB,
} from "@fixtures/auth-fixtures";
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

	test("[ENG-6271] User info - notes", async ({
		gamdomApi,
		page,
		userInfoAdminPage,
		infoAdminPage,
	}) => {
		const superAdminUserData = new RegisterTestData();
		storageStateNewSuperAdminUserDB({
			username: superAdminUserData.username,
			password: superAdminUserData.password,
		});
		const cookie = await gamdomApi.authenticateWithNewSuperAdminUser(
			superAdminUserData,
		);
		await setAuthenticationCookies(page, cookie);

		await userInfoAdminPage.navigate();
		await userInfoAdminPage.steps().showUserDetails(userData.username);

		const [, noteToPin, noteToSetInactive] = await infoAdminPage
			.steps()
			.createNote(3);
		await infoAdminPage.steps().pinNoteByText(noteToPin);
		await infoAdminPage.assertThat().noteIsPinned(noteToPin);

		await infoAdminPage.steps().setNoteInactiveByText(noteToSetInactive);
		await infoAdminPage.assertThat().noteIsInactive(noteToSetInactive);

		await infoAdminPage.refresh();

		await infoAdminPage.assertThat().noteIsPinned(noteToPin);
	});
});
