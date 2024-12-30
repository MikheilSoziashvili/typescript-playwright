import { ChatMessageOptions } from "@components/chat/chat-map";
import { USER_2_CREDENTIALS } from "@constants/credentials";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { test } from "@fixtures/fixtures";

const message = generateRandomString({ prefix: "automation_msg_" });
const messageInfo: ChatMessageOptions = {
	username: USER_2_CREDENTIALS.username,
	message: message,
};

test.describe("User statistics tests", () => {
	test.beforeEach(
		async ({ gamdomApi, homePage, chat, profilePage, page }) => {
			const cookie = await gamdomApi.authenticateWithExistingUser(
				USER_2_CREDENTIALS.username,
				USER_2_CREDENTIALS.password,
			);
			await setAuthenticationCookies(page, cookie);
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
		gamdomApi,
		homePage,
		chat,
		userProfileModal,
		page,
	}) => {
		test.slow();
		const newUser = new RegisterTestData();
		const cookie = await gamdomApi.authenticateWithNewUser(newUser);
		await setAuthenticationCookies(page, cookie);
		await homePage.navigate();
		//await homePage.authenticatedHeader.expandChatIfNotVisible();

		await chat.assertThat().isDisplayed();
		await chat
			.assertThat()
			.isPlaceholderVisible(ChatFooterPlaceholder.START_TYPING);
		await chat.assertThat().isMessageVisible(messageInfo);

		await chat.steps().openUserProfileModal(messageInfo);
		await userProfileModal.assertThat().isPrivateUserModeDisplayed();
	});

	test.afterEach(async ({ gamdomApi, homePage, profilePage, page }) => {
		await homePage.navigate({ cookies: { clearCookies: true } });
		const cookie = await gamdomApi.authenticateWithExistingUser(
			USER_2_CREDENTIALS.username,
			USER_2_CREDENTIALS.password,
		);
		await setAuthenticationCookies(page, cookie);
		await profilePage.navigate();
		await profilePage.steps().toggleUserStatisticsMode("off");
	});
});
