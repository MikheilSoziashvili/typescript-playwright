import { ChatMessageOptions } from "@components/chat/chat-map";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";

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
			await profilePage.steps().toggleUserStatisticsMode("on");
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
