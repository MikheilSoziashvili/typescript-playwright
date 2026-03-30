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
import { TestUserRole } from "@enums/test-user-roles";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";
import { JiraComponent } from "@enums/jira/jira-components";

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
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
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
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
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
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
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

test.describe(
	`[ENG-11852] "Ignore" user from the chat - v4`,
	testDetails()
		.withTags(TestTag.V4, JiraComponent.CHAT, JiraComponent.PRIVACY)
		.apply(),
	() => {
		const chatDomainData = testData().fromDomain().chat;

		test.describe("Ignoring a user - v4", () => {
			test(
				`Ignoring an user - v4`,
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager }) => {
					const user1 = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
						{
							reuseContext: true,
						},
					);

					const user2 = await browserSessionManager.loginAs(
						TestUserRole.SUPERADMIN,
					);

					const user1Username =
						user1.getAuthenticatedUser().user.username;

					const ignoreUserScenarioData =
						chatDomainData.buildIgnoreUserScenarioData(
							user1Username,
						);

					const [pair1, pair2] = ignoreUserScenarioData.messagePairs;
					const tipUserInfoMessage =
						ignoreUserScenarioData.tipUserInfoMessage;

					// Send message as user1
					await user1.pages.homePage.navigate();
					await user1.pages.chat.expandChatV4();
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisibleV4(
							pair1.message,
							pair1.info,
						);

					// As user2 find the chat message and ignore user1
					await user2.pages.homePage.navigate();
					await user2.pages.chat.expandChatV4();
					await user2.pages.chat
						.assertThat()
						.isMessageVisibleV4(pair1.info);
					await user2.pages.chat
						.steps()
						.ignoreUserFromChatV4(pair1.info);
					await user2.pages.chat
						.assertThat()
						.isInfoMessageVisibleV4(
							tipUserInfoMessage,
							user1Username,
						);
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisibleV4(pair1.info);

					// Send a new message as user1
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisibleV4(
							pair2.message,
							pair2.info,
						);

					// Assert newly sent message from user1 is not visible as user2
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisibleV4(pair2.info);

					// Navigate with user2 to the privacy page
					await user2.pages.privacyPage.navigate();
					await user2.pages.privacyPage
						.assertThat()
						.userIsIgnoredV4(user1Username);
				},
			);
		});

		test.describe(`Changing an ignored user's username - v4`, () => {
			test(
				`Changing an ignored user's username - v4`,
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager }) => {
					const user1 = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
						{
							reuseContext: true,
						},
					);

					const user2 = await browserSessionManager.loginAs(
						TestUserRole.SUPERADMIN,
					);

					const user1Username =
						user1.getAuthenticatedUser().user.username;

					const { messagePairs } =
						chatDomainData.buildIgnoreUserScenarioData(
							user1Username,
						);
					const [pair1, pair2] = messagePairs;

					// Send message as user1
					await user1.pages.homePage.navigate();
					await user1.pages.chat.expandChatV4();
					await user1.pages.chat.steps().sendMessageV4(pair1.message);

					// As user2 find the chat message and ignore user1
					await user2.pages.homePage.navigate();
					await user2.pages.chat.expandChatV4();
					await user2.pages.chat
						.steps()
						.ignoreUserFromChatV4(pair1.info);

					const newUsername = testData()
						.fromRandom()
						.data.username.username();
					pair2.info.username = newUsername;

					//Change username for user1
					await user1.pages.profilePage.navigate();
					await user1.pages.profilePage
						.steps()
						.changeUsernameV4(newUsername);

					// Send a new message as user1
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisibleV4(
							pair2.message,
							pair2.info,
						);

					// Assert newly sent message from user1 is not visible as user2
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisibleV4(pair2.info);
				},
			);
		});

		test.describe(`Unignoring an ignored user - v4`, () => {
			test(
				`Unignoring an ignored user - v4`,
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager }) => {
					const user1 = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
						{
							reuseContext: true,
						},
					);

					const user2 = await browserSessionManager.loginAs(
						TestUserRole.SUPERADMIN,
					);

					const user1Username =
						user1.getAuthenticatedUser().user.username;

					const { messagePairs } =
						chatDomainData.buildIgnoreUserScenarioData(
							user1Username,
						);
					const [pair1, pair2] = messagePairs;

					// Send message as user1
					await user1.pages.homePage.navigate();
					await user1.pages.chat.expandChatV4();
					await user1.pages.chat.steps().sendMessageV4(pair1.message);

					// As user2 find the chat message and ignore user1
					await user2.pages.homePage.navigate();
					await user2.pages.chat.expandChatV4();
					await user2.pages.chat
						.steps()
						.ignoreUserFromChatV4(pair1.info);
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisibleV4(pair1.info);

					// As user2 unignore user1
					await user2.pages.privacyPage.navigate();
					await user2.pages.privacyPage.clickUnignoreUserV4(
						user1Username,
					);
					await user2.pages.unblockUserModalV4.clickUnblockButtonV4();
					await user2.pages.chat
						.assertThat()
						.isMessageVisibleV4(pair1.info);

					// Send a new message as user1
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisibleV4(
							pair2.message,
							pair2.info,
						);

					// Assert newly sent message from user1 is visible as user2
					await user2.pages.chat
						.assertThat()
						.isMessageVisibleV4(pair2.info);
				},
			);
		});
	},
);
