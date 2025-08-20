import { test } from "@fixtures/fixtures";
import {
	buildMessagePairs,
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { RegisterTestData } from "@dtos/test-data";
import { HomePage } from "@pages/home-page/home-page";
import { Chat } from "@pages/components/chat/chat";
import { buildIgnoreUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import { PrivacyPage } from "@pages/privacy/privacy-page";

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
		const userData = new RegisterTestData();
		test.use(
			storageStateNewUserDB(
				{
					username: userData.username,
					password: userData.password,
					email: userData.email,
					emailVerified: true,
					startingXp: 10000000,
				},
				userData,
			),
		);
		test(`Ignoring an user`, async ({ homePage, chat }) => {
			const [pair1, pair2] = buildMessagePairs(userData.username);

			const tipUserInfoMessage = buildIgnoreUserMessageInfo({
				ignoredUser: userData.username,
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
				.isInfoMessageVisible(tipUserInfoMessage);
			await user2Chat.assertThat().messageIsNotVisible(pair1.info);

			// Send a new message as user1
			await chat
				.steps()
				.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);

			// Assert newly sent message from user1 is not visible as user2
			await user2Chat.assertThat().messageIsNotVisible(pair2.info);

			// Navigate with user2 to the privacy page
			await user2Privacy.navigate();
			await user2Privacy.assertThat().userIsIgnored(userData.username);
		});
	});

	test.describe(`Changing an ignored user's username`, () => {
		const userData = new RegisterTestData();
		test.use(
			storageStateNewUserDB(
				{
					username: userData.username,
					password: userData.password,
					email: userData.email,
					emailVerified: true,
					startingXp: 10000000,
				},
				userData,
			),
		);
		test(`Changing an ignored user's username`, async ({
			homePage,
			chat,
			profilePage,
		}) => {
			const [pair1, pair2] = buildMessagePairs(userData.username);

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
		});
	});

	test.describe(`Unignoring an ignored user`, () => {
		const userData = new RegisterTestData();
		test.use(
			storageStateNewUserDB(
				{
					username: userData.username,
					password: userData.password,
					email: userData.email,
					emailVerified: true,
					startingXp: 10000000,
				},
				userData,
			),
		);
		test(`Unignoring an ignored user`, async ({ homePage, chat }) => {
			const [pair1, pair2] = buildMessagePairs(userData.username);

			// Send message as user1
			await homePage.steps().navigateAndExpandChat();
			await chat.steps().sendMessage(pair1.message);

			// As user2 find the chat message and ignore user1
			await user2HomePage.steps().navigateAndExpandChat();
			await user2Chat.steps().ignoreUserFromChat(pair1.info);
			await user2Chat.assertThat().messageIsNotVisible(pair1.info);

			// As user2 unignore user1
			await user2Privacy.navigate();
			await user2Privacy.unignoreUser(userData.username);
			await user2Chat.assertThat().isMessageVisible(pair1.info);

			// Send a new message as user1
			await chat
				.steps()
				.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);

			// Assert newly sent message from user1 is visible as user2
			await user2Chat.assertThat().isMessageVisible(pair2.info);
		});
	});
});
