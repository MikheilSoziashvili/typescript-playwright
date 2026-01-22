import { ChatMessageOptions } from "@components/chat/chat-map";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { UserPrivacyOption } from "@enums/user-privacy-options";
import { ToggleOptions } from "@enums/visibility-options";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

const userHiddenStats = new RegisterTestData();
const message = generateRandomString({ prefix: "automation_msg_" });
const messageInfo: ChatMessageOptions = {
	username: userHiddenStats.username,
	message: message,
};

test.describe("User statistics tests", () => {
	test.beforeEach(
		async ({ gamdomApi, homePage, chat, profilePage, page, gamdomDb }) => {
			await gamdomDb.createNewUser({
				username: userHiddenStats.username,
				password: userHiddenStats.password,
				email: userHiddenStats.email,
				emailVerified: true,
			});
			const cookie = await gamdomApi.authenticateWithExistingUser(
				userHiddenStats.username,
				userHiddenStats.password,
			);
			await setAuthenticationCookies(page, cookie);
			await profilePage.navigate();
			await profilePage
				.steps()
				.toggleUserPrivacy(
					UserPrivacyOption.STATISTICS,
					ToggleOptions.ON,
				);
			await homePage.navigate();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.steps().sendMessage(message);
			await homePage.navigate({ cookies: { clearCookies: true } });
		},
	);

	test(
		"[ENG-300] Hide statistics from other users",
		testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
		async ({
			gamdomApi,
			gamdomDb,
			homePage,
			chat,
			userProfileModal,
			page,
			testDataObject,
		}) => {
			test.slow();
			const newUser = testDataObject.register.random();
			await gamdomDb.createNewUser(newUser);
			const cookie = await gamdomApi.authenticateWithExistingUser(
				newUser.username,
				newUser.password,
			);
			await setAuthenticationCookies(page, cookie);
			await homePage.navigate();
			await homePage.authenticatedHeader.expandChatIfNotVisible();

			await chat.assertThat().chatIsDisplayed();
			await chat.removeFocus();
			await chat
				.assertThat()
				.isPlaceholderVisible(ChatFooterPlaceholder.START_TYPING);
			await chat.assertThat().isMessageVisible(messageInfo);

			await chat.steps().openUserProfileModal(messageInfo);
			await userProfileModal.assertThat().isPrivateUserModeDisplayed();
		},
	);
});

test.describe(
	"User statistics tests - v4",
	testDetails()
		.withTags(TestTag.V4, JiraComponent.PROFILE, JiraComponent.PRIVACY)
		.apply(),
	() => {
		test(
			"[ENG-13938] Hidden statistics - ON - v4",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
			async ({ browserSessionManager }) => {
				const user1 = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);

				const user2 = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				await user1.pages.privacyPage.navigate();
				await user1.pages.privacyPage
					.steps()
					.enableHiddenStatisticsV4();

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
				await user1.pages.chat.expandChatV4();
				await user1.pages.chat.steps().sendMessageV4(message);
				await user1.pages.chat
					.assertThat()
					.isMessageVisibleV4(messageInfo);

				// User2 opens chat, finds user1's message, then clicks avatar to inspect stats
				await user2.pages.homePage.navigate();
				await user2.pages.chat.expandChatV4();
				await user2.pages.chat
					.assertThat()
					.isMessageVisibleV4(messageInfo);

				// Open user1 profile from the message avatar and verify statistics are hidden
				await user2.pages.chat
					.steps()
					.openUserProfileModalV4(messageInfo);

				await user2.pages.userProfileModalV4.waitContentToLoadV4();
				await user2.pages.userProfileModalV4
					.assertThat()
					.isDisplayedV4();
				await user2.pages.userProfileModalV4
					.assertThat()
					.isPrivateUserModeDisplayedV4();
			},
		);
	},
);
