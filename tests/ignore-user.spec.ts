import { test } from "@fixtures/fixtures";
import {
	buildMessagePairs,
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { HomePage } from "@pages/home-page/home-page";
import { Chat } from "@pages/components/chat/chat";
import { buildIgnoreUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import { PrivacyPage } from "@pages/privacy/privacy-page";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";

test.describe(`[ENG-1334] "Ignore" user from the chat`, () => {
	let user2Context;
	let user2HomePage: HomePage;
	let user2Chat: Chat;
	let user2Privacy: PrivacyPage;

	test.beforeEach(async ({ browser, gamdomApiDbFacade }) => {
		const { cookie } = await gamdomApiDbFacade.createSingleUserDbAndAuth({
			emailVerified: true,
		});

		user2Context = await browser.newContext();
		const user2Page = await user2Context.newPage();
		await setAuthenticationCookies(user2Page, cookie);
		user2HomePage = new HomePage(user2Page);
		user2Chat = new Chat(user2Page);
		user2Privacy = new PrivacyPage(user2Page);
	});

	test.describe("Ignoring a user", () => {
		test(
			`Ignoring an user`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ homePage, chat, gamdomApiDbFacade }) => {
				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						emailVerified: true,
						startingXp: 10000000,
					});
				await setAuthenticationCookies(homePage.page, cookie);

				const [pair1, pair2] = buildMessagePairs(user.username);

				const tipUserInfoMessage = buildIgnoreUserMessageInfo({
					ignoredUser: user.username,
				});

				// Send message as user1
				await homePage.steps().navigateAndExpandChat();
				await chat
					.steps()
					.sendMessageAndVerifyItsVisible(pair1.message, pair1.info);

				// As user2 find the chat message and ignore user1
				await user2HomePage.steps().navigateAndExpandChat();
				await user2Chat.assertThat().isMessageVisible(pair1.info);
				await user2Chat.steps().ignoreUserFromChat(pair1.info);
				await user2Chat
					.assertThat()
					.isInfoMessageVisible(tipUserInfoMessage, user.username);
				await user2Chat.assertThat().messageIsNotVisible(pair1.info);

				// Send a new message as user1
				await chat
					.steps()
					.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);

				// Assert newly sent message from user1 is not visible as user2
				await user2Chat.assertThat().messageIsNotVisible(pair2.info);

				// Navigate with user2 to the privacy page
				await user2Privacy.navigate();
				await user2Privacy.assertThat().userIsIgnored(user.username);
			},
		);
	});

	test.describe(`Changing an ignored user's username`, () => {
		test(
			`Changing an ignored user's username`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ homePage, chat, profilePage, gamdomApiDbFacade }) => {
				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						emailVerified: true,
						startingXp: 10000000,
					});
				await setAuthenticationCookies(homePage.page, cookie);
				const [pair1, pair2] = buildMessagePairs(user.username);

				// Send message as user1
				await homePage.steps().navigateAndExpandChat();
				await chat.steps().sendMessage(pair1.message);

				// As user2 find the chat message and ignore user1
				await user2HomePage.steps().navigateAndExpandChat();
				await user2Chat.steps().ignoreUserFromChat(pair1.info);

				// Change username as user1
				const newUsername = generateRandomString({
					length: 6,
				});
				pair2.info.username = newUsername;

				await profilePage.navigate();
				await profilePage.steps().changeUsername(newUsername);

				// Send a new message as user1
				await chat
					.steps()
					.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);

				// Assert newly sent message from user1 is not visible as user2
				await user2Chat.assertThat().messageIsNotVisible(pair2.info);
			},
		);
	});

	test.describe(`Unignoring an ignored user`, () => {
		test(
			`Unignoring an ignored user`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ homePage, chat, gamdomApiDbFacade }) => {
				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						emailVerified: true,
						startingXp: 10000000,
					});
				await setAuthenticationCookies(homePage.page, cookie);
				const [pair1, pair2] = buildMessagePairs(user.username);

				// Send message as user1
				await homePage.steps().navigateAndExpandChat();
				await chat.steps().sendMessage(pair1.message);

				// As user2 find the chat message and ignore user1
				await user2HomePage.steps().navigateAndExpandChat();
				await user2Chat.steps().ignoreUserFromChat(pair1.info);
				await user2Chat.assertThat().messageIsNotVisible(pair1.info);

				// As user2 unignore user1
				await user2Privacy.navigate();
				await user2Privacy.unignoreUser(user.username);
				await user2Chat.assertThat().isMessageVisible(pair1.info);

				// Send a new message as user1
				await chat
					.steps()
					.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);

				// Assert newly sent message from user1 is visible as user2
				await user2Chat.assertThat().isMessageVisible(pair2.info);
			},
		);
	});
});
