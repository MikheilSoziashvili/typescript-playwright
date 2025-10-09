import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";

test.describe("User info - notes", () => {
	test.beforeEach(async ({ page, gamdomApiDbFacade, userInfoAdminPage }) => {
		const { cookie } =
			await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
		await setAuthenticationCookies(page, cookie);

		const { user } = await gamdomApiDbFacade.createSingleUserDbAndAuth();

		await userInfoAdminPage.navigate();
		await userInfoAdminPage.steps().showUserDetails(user.username);
	});

	test(
		"[ENG-6271] [UserInfo] Check that a Pinned note is still pinned after deleting a note and refreshing the page",
		testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
		async ({ infoAdminPage }) => {
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

	test(
		"[ENG-3025] [Notes] Adding multiple notes to a user",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
		async ({ infoAdminPage }) => {
			await infoAdminPage.steps().createNote(3);
			await infoAdminPage.assertThat().notesSortedByCreationTime();
		},
	);
});
