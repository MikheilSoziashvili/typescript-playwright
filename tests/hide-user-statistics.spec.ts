import { ChatMessageOptions } from "@components/chat/chat-map";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"User statistics tests",
	testDetails()
		.withTags(JiraComponent.PROFILE, JiraComponent.PRIVACY)
		.apply(),
	() => {
		test(
			"[ENG-13938] Hidden statistics - ON",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ browserSessionManager }) => {
				const user1 = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);

				const user2 = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				await user1.pages.privacyPage.navigate();
				await user1.pages.privacyPage.steps().enableHiddenStatistics();

				// User1 sends a chat message
				const user1Username =
					user1.getAuthenticatedUser().user.username;
				const message = testData()
					.fromRandom()
					.data.chatMessage.message();
				const messageInfo: ChatMessageOptions = {
					username: user1Username,
					message: message,
				};

				await user1.pages.homePage.navigate();
				await user1.pages.chat.expandChat();
				await user1.pages.chat.steps().sendMessage(message);
				await user1.pages.chat
					.assertThat()
					.isMessageVisible(messageInfo);

				// User2 opens chat, finds user1's message, then clicks avatar to inspect stats
				await user2.pages.homePage.navigate();
				await user2.pages.chat.expandChat();
				await user2.pages.chat
					.assertThat()
					.isMessageVisible(messageInfo);

				// Open user1 profile from the message avatar and verify statistics are hidden
				await user2.pages.chat
					.steps()
					.openUserProfileModal(messageInfo);

				await user2.pages.userProfileModal.waitContentToLoad();
				await user2.pages.userProfileModal.assertThat().isDisplayed();
				await user2.pages.userProfileModal
					.assertThat()
					.isPrivateUserModeDisplayed();
			},
		);
	},
);
