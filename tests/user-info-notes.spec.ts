import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";

test.describe(
	"User info - notes",
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.USER_INFO)
		.apply(),
	() => {
		test.beforeEach(
			async ({ page, gamdomApiDbFacade, userInfoAdminPage }) => {
				const { cookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);

				const { user } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();

				await userInfoAdminPage.navigate();
				await userInfoAdminPage.steps().showUserDetails(user.username);
			},
		);

		test(
			"[ENG-6271] [UserInfo] Check that a Pinned note is still pinned after deleting a note and refreshing the page",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ infoAdminPage }) => {
				const [, noteToPin, noteToSetInactive] = await infoAdminPage
					.steps()
					.createNote(3);
				await infoAdminPage
					.steps()
					.pinNoteAndAssertItsPinned(noteToPin);

				await infoAdminPage.setNoteInactiveByText(noteToSetInactive);
				await infoAdminPage
					.assertThat()
					.noteIsInactive(noteToSetInactive);

				await infoAdminPage.refresh();

				await infoAdminPage.assertThat().noteIsPinned(noteToPin);
			},
		);

		test(
			"[ENG-3025] [Notes] Adding multiple notes to a user",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ infoAdminPage }) => {
				await infoAdminPage.steps().createNote(3);
				await infoAdminPage.assertThat().notesSortedByCreationTime();
			},
		);

		test(
			"[ENG-3026] Pinning/unpinning a note",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ infoAdminPage }) => {
				const [noteToPin] = await infoAdminPage.steps().createNote(1);
				await infoAdminPage
					.steps()
					.pinNoteAndAssertItsPinned(noteToPin);

				await infoAdminPage.steps().createNote(2);
				await infoAdminPage.assertThat().pinnedNoteIsAtTop(noteToPin);

				await infoAdminPage.unpinNoteByText(noteToPin);

				await infoAdminPage.assertThat().notesSortedByCreationTime();
			},
		);
	},
);
