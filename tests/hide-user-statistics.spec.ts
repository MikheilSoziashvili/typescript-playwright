import { test } from "@fixtures/fixtures";
import { ChatMessageOptions } from "@components/chat/chat-map";
import { generateRandomString } from "@core/utils/utils";
import { USER_1_CREDENTIALS, USER_2_CREDENTIALS } from "@constants/credentials";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";

const message = generateRandomString({ prefix: "automation_msg_" });
const messageInfo: ChatMessageOptions = {
	username: USER_2_CREDENTIALS.username,
	message: message,
};

test.describe("User statistics tests", () => {
	test.beforeEach(
		async ({ gamdomApiActions, homePage, chat, profilePage }) => {
			await gamdomApiActions.authenticateWithExistingUser(
				USER_2_CREDENTIALS.username,
				USER_2_CREDENTIALS.password,
			);
			await profilePage.navigate();
			await profilePage.steps().toggleUserStatisticsMode("on");
			await homePage.navigate();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.steps().sendMessage(message);
			// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
			await chat
				.steps()
				.sendMessage(
					generateRandomString({ prefix: "automation_msg_2" }),
				);
			await homePage.navigate({ cookies: { clearCookies: true } });
		},
	);

	test("[ENG-300] Hide statistics from other users", async ({
		gamdomApiActions,
		homePage,
		chat,
		userProfileModal,
	}) => {
		test.slow();
		await gamdomApiActions.authenticateWithExistingUser(
			USER_1_CREDENTIALS.username,
			USER_1_CREDENTIALS.password,
		);
		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();

		await chat.assertThat().isDisplayed();
		await chat
			.assertThat()
			.isPlaceholderVisible(ChatFooterPlaceholder.START_TYPING);
		await chat.assertThat().isMessageVisible(messageInfo);

		await chat.steps().openUserProfileModal(messageInfo);
		await userProfileModal.assertThat().isPrivateUserModeDisplayed();
	});

	test.afterEach(async ({ gamdomApiActions, homePage, profilePage }) => {
		await homePage.navigate({ cookies: { clearCookies: true } });
		await gamdomApiActions.authenticateWithExistingUser(
			USER_2_CREDENTIALS.username,
			USER_2_CREDENTIALS.password,
		);
		await profilePage.navigate();
		await profilePage.steps().toggleUserStatisticsMode("off");
	});
});
