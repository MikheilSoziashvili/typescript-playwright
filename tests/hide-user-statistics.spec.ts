import { test } from "../fixtures/fixtures";
import { ChatMessageOptions } from "../pages/components/chat/chat-map";
import { generateRandomString } from "../core/utils";
import {
	USER_1_CREDENTIALS,
	USER_2_CREDENTIALS,
} from "../constants/credentials";
import { ChatFooterPlaceholders } from "../enums/chat-footer-palceholders";

const message = generateRandomString({ prefix: "automation_msg_" });
const messageInfo: ChatMessageOptions = {
	username: USER_2_CREDENTIALS.username,
	message: message,
};

test.describe("User statistics tests", () => {
	test.beforeEach(async ({ homePage, chat, profilePage }) => {
		await homePage.steps().loginUsername(USER_2_CREDENTIALS.username);
		await homePage.clickUserProfileButton();

		await profilePage.steps().toggleUserStatisticsMode("off");

		await chat.sendMessage(message);
		// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
		await chat.sendMessage(
			generateRandomString({ prefix: "automation_msg_2" }),
		);
		await profilePage.logout();
	});

	test("[QA-279] Hide user statistics @smoke", async ({
		homePage,
		chat,
		userProfileModal,
	}) => {
		test.slow();
		await homePage.navigateAndCheckTitle();
		await homePage.steps().loginUsername(USER_1_CREDENTIALS.username);
		await chat.assertThat().isDisplayed();
		await chat
			.assertThat()
			.isPlaceholderVisible(ChatFooterPlaceholders.START_TYPING);
		await chat.assertThat().isMessageVisible(messageInfo);

		await chat.steps().openUserProfileModal(messageInfo);
		await userProfileModal.assertThat().isPrivateUserModeDisplayed();
	});

	test.afterEach(async ({ homePage, profilePage }) => {
		await profilePage.navigate();
		await profilePage.logout();

		await homePage.steps().loginUsername(USER_2_CREDENTIALS.username);
		await homePage.clickUserProfileButton();

		await profilePage.steps().toggleUserStatisticsMode("on");
	});
});
