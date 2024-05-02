import { test } from "../fixtures/fixtures";
import { ChatFooterPlaceholders } from "../enums/chat-footer-palceholders";
import { ChatMessageOptions } from "../pages/components/chat/chat-map";
import { generateRandomString } from "../core/utils";
import {
	USER_1_CREDENTIALS,
	USER_2_CREDENTIALS,
} from "../constants/credentials";
import { ToastTitles } from "../enums/toast-titles";
import {
	buildTipUserMessageInfo,
	buildTipUserSubTitle,
} from "../core/feedback-utils";

test.describe("Tip user tests", () => {
	const message_1 = generateRandomString({ prefix: "automation_message_" });
	const messageInfo_1: ChatMessageOptions = {
		username: USER_1_CREDENTIALS.username,
		message: message_1,
	};
	let user1AccountBalance: number;
	const tipValue = 10;

	test.beforeEach(async ({ homePage, chat, profilePage }) => {
		await homePage.navigateAndCheckTitle();
		await homePage.steps().loginUsername(USER_1_CREDENTIALS.username);
		await homePage.authenticatedHeader.expandChatIfNotVisible();

		await chat.steps().sendMessage(message_1);
		// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
		const message_2 = generateRandomString({
			prefix: "automation_message_",
		});
		await chat.steps().sendMessage(message_2);
		user1AccountBalance =
			await homePage.authenticatedHeader.getAccountBalance();
		await profilePage.navigate();
		await profilePage.logout();
	});

	test("[ENG-290] 'Tip User' from the chat @smoke", async ({
		homePage,
		chat,
		tipUserModal,
		toast,
		profilePage,
	}) => {
		test.slow();
		await homePage.navigateAndCheckTitle();
		await chat.assertThat().isDisplayed();
		await chat
			.assertThat()
			.isPlaceholderVisible(ChatFooterPlaceholders.LOGIN_TO_CHAT);

		await homePage.steps().loginUsername(USER_2_CREDENTIALS.username);
		await chat.assertThat().isDisplayed();
		await chat.assertThat().isMessageVisible(messageInfo_1);

		const user2AccountBalance =
			await homePage.authenticatedHeader.getAccountBalance();

		await chat.steps().openTipUserModal(messageInfo_1);
		await tipUserModal.insertTipValue(tipValue);
		await tipUserModal.assertThat().isValueVisible(tipValue);

		await tipUserModal.clearTipValue();
		await tipUserModal.assertThat().isValueVisible(0);

		await tipUserModal.tipUser(tipValue);

		await toast.assertThat().titleIs(ToastTitles.SUCCESS);
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: messageInfo_1.username,
				tipAmount: tipValue,
			}),
			// `You have given ${
			// 	messageInfo_1.username
			// } a tip of ${DEFAULT_CURRENCY}${parseToFloat(tipValue)}.`,
		);
		await chat.assertThat().isInfoMessageVisible(
			buildTipUserMessageInfo({
				senderUsername: USER_2_CREDENTIALS.username,
				receiverUsername: USER_1_CREDENTIALS.username,
				tipAmount: tipValue,
			}),
		);
		await homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(user2AccountBalance - Number(tipValue));
		await chat
			.assertThat()
			.isPlaceholderVisible(ChatFooterPlaceholders.START_TYPING);

		await profilePage.navigate();
		await profilePage.logout();

		await homePage.steps().loginUsername(USER_1_CREDENTIALS.username);
		await homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(user1AccountBalance + Number(tipValue));
	});
});
