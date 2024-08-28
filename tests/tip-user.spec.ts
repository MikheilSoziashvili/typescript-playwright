import { test } from "@fixtures/fixtures";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { ChatMessageOptions } from "@components/chat/chat-map";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { USER_1_CREDENTIALS, USER_2_CREDENTIALS } from "@constants/credentials";
import { ToastTitle } from "@enums/toast-titles";
import {
	buildTipUserMessageInfo,
	buildTipUserSubTitle,
} from "@core/helpers/asserter-helpers/text-asserters";

test.describe("Tip user tests", () => {
	const message_1 = generateRandomString({ prefix: "automation_message_" });
	const messageInfo_1: ChatMessageOptions = {
		username: USER_1_CREDENTIALS.username,
		message: message_1,
	};
	let user1AccountBalance: number;
	const tipValue = 10;

	test.beforeEach(async ({ gamdomApi, homePage, chat, page }) => {
		const cookie = await gamdomApi.authenticateWithExistingUser(
			USER_1_CREDENTIALS.username,
			USER_1_CREDENTIALS.password,
		);
		await setAuthenticationCookies(page, cookie);
		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();

		await chat.steps().sendMessage(message_1);
		// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
		const message_2 = generateRandomString({
			prefix: "automation_message_",
		});
		await chat.steps().sendMessage(message_2);
		user1AccountBalance =
			await homePage.authenticatedHeader.getAccountBalance();
	});

	test("[ENG-290] 'Tip User' from the chat @smoke", async ({
		homePage,
		gamdomApi,
		chat,
		tipUserModal,
		toast,
		page,
	}) => {
		test.slow();
		await homePage.navigate({ cookies: { clearCookies: true } });
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await chat.assertThat().isDisplayed();
		await chat
			.assertThat()
			.isPlaceholderVisible(ChatFooterPlaceholder.LOGIN_TO_CHAT);

		const cookie = await gamdomApi.authenticateWithExistingUser(
			USER_2_CREDENTIALS.username,
			USER_2_CREDENTIALS.password,
		);
		await setAuthenticationCookies(page, cookie);

		await homePage.navigate();
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

		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: messageInfo_1.username,
				tipAmount: tipValue,
			}),
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
			.isPlaceholderVisible(ChatFooterPlaceholder.START_TYPING);

		await homePage.navigate({ cookies: { clearCookies: true } });
		const cookieUser1 = await gamdomApi.authenticateWithExistingUser(
			USER_1_CREDENTIALS.username,
			USER_1_CREDENTIALS.password,
		);
		await setAuthenticationCookies(page, cookieUser1);
		await homePage.navigate();
		await homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(user1AccountBalance + Number(tipValue));
	});
});
