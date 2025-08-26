import { test } from "@fixtures/fixtures";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { ChatMessageOptions } from "@components/chat/chat-map";
import {
	encodeCookieHeader,
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { ToastTitle } from "@enums/toast-titles";
import {
	buildTipUserMessageInfo,
	buildTipUserSubTitle,
} from "@core/helpers/asserter-helpers/text-asserters";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Currency } from "@enums/currencies";
import { HomePage } from "@pages/home-page/home-page";
import { Chat } from "@pages/components/chat/chat";
import { UserData } from "@core/facades/gamdom-api-db/interfaces";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";

test.describe("Tip user tests", () => {
	let user1: UserData;
	let user2: UserData;
	const tipValue = 10;

	test(
		"[ENG-290] 'Tip User' from the chat",
		testDetails()
			.withTags(TestTag.SMOKE)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({
			homePage,
			gamdomApi,
			chat,
			tipUserModal,
			toast,
			page,
			gamdomApiDbFacade,
			browser,
		}) => {
			test.slow();
			//Create 2 test users at once
			const users = await gamdomApiDbFacade.createUsersDb({
				usersCount: 2,
				emailVerified: true,
				wagered: 45000,
			});

			[user1, user2] = users;

			//Authenticate with User 2 and send a message in the chat
			const user2Cookie = await gamdomApi.authenticateWithExistingUser(
				user2.username,
				user2.password,
			);

			const user2Context = await browser.newContext();
			const user2Page = await user2Context.newPage();
			await setAuthenticationCookies(user2Page, user2Cookie);
			const user2HomePage = new HomePage(user2Page);
			const user2Chat = new Chat(user2Page);

			await user2HomePage.navigate();
			await user2HomePage.authenticatedHeader.expandChatIfNotVisible();

			const message_1 = generateRandomString({
				prefix: "automation_message_",
			});
			const messageInfo_1: ChatMessageOptions = {
				username: user2.username,
				message: message_1,
			};

			await user2Chat.steps().sendMessage(message_1);
			// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
			const message_2 = generateRandomString({
				prefix: "automation_message_",
			});
			await user2Chat.steps().sendMessage(message_2);

			const user2AccountBalance =
				await user2HomePage.authenticatedHeader.getAccountBalance();
			await user2HomePage.navigate({ cookies: { clearCookies: true } });
			await user2HomePage.authenticatedHeader.expandChatIfNotVisible();
			await user2Chat.assertThat().chatIsDisplayed();
			await user2Chat
				.assertThat()
				.isPlaceholderVisible(ChatFooterPlaceholder.LOGIN_TO_CHAT);

			//Authenticate with User 1 and tip User 2
			const user1Cookie = await gamdomApi.authenticateWithExistingUser(
				user1.username,
				user1.password,
			);

			const headersUser1 = {
				Cookie: await encodeCookieHeader(user1Cookie),
			};
			await setAuthenticationCookies(page, user1Cookie);

			await homePage.navigate();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.assertThat().chatIsDisplayed();
			await chat.assertThat().isMessageVisible(messageInfo_1);

			const user1AccountBalance =
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
					senderUsername: user1.username,
					receiverUsername: user2.username,
					tipAmount: tipValue,
				}),
			);

			//Verify User 1's account balance
			await homePage.authenticatedHeader
				.assertThat()
				.accountBalanceIs(
					user1AccountBalance - Number(tipValue),
					Unit.COINS,
					Currency.USD,
					WalletType.DEFAULT,
					headersUser1,
				);
			await chat
				.assertThat()
				.isPlaceholderVisible(ChatFooterPlaceholder.START_TYPING);

			await homePage.navigate({ cookies: { clearCookies: true } });

			//Authenticate with User 2 and verify balance is updated
			const cookieUser2 = await gamdomApi.authenticateWithExistingUser(
				user2.username,
				user2.password,
			);
			const headersUser2 = {
				Cookie: await encodeCookieHeader(cookieUser2),
			};
			await setAuthenticationCookies(page, cookieUser2);
			await user2HomePage.navigate();
			await user2HomePage.authenticatedHeader
				.assertThat()
				.accountBalanceIs(
					user2AccountBalance + Number(tipValue),
					Unit.COINS,
					Currency.USD,
					WalletType.DEFAULT,
					headersUser2,
				);
		},
	);
});
