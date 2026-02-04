import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	`[ENG-11852] "Ignore" user from the chat`,
	testDetails().withTags(JiraComponent.CHAT, JiraComponent.PRIVACY).apply(),
	() => {
		const chatDomainData = testData().fromDomain().chat;

		test.describe("Ignoring a user", () => {
			test(
				`Ignoring an user`,
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
					await user1.pages.chat.expandChat();
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisible(
							pair1.message,
							pair1.info,
						);

					// As user2 find the chat message and ignore user1
					await user2.pages.homePage.navigate();
					await user2.pages.chat.expandChat();
					await user2.pages.chat
						.assertThat()
						.isMessageVisible(pair1.info);
					await user2.pages.chat
						.steps()
						.ignoreUserFromChat(pair1.info);
					await user2.pages.chat
						.assertThat()
						.isInfoMessageVisible(
							tipUserInfoMessage,
							user1Username,
						);
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisible(pair1.info);

					// Send a new message as user1
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisible(
							pair2.message,
							pair2.info,
						);

					// Assert newly sent message from user1 is not visible as user2
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisible(pair2.info);

					// Navigate with user2 to the privacy page
					await user2.pages.privacyPage.navigate();
					await user2.pages.privacyPage
						.assertThat()
						.userIsIgnored(user1Username);
				},
			);
		});

		test.describe(`Changing an ignored user's username`, () => {
			test(
				`Changing an ignored user's username`,
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
					await user1.pages.chat.expandChat();
					await user1.pages.chat.steps().sendMessage(pair1.message);

					// As user2 find the chat message and ignore user1
					await user2.pages.homePage.navigate();
					await user2.pages.chat.expandChat();
					await user2.pages.chat
						.steps()
						.ignoreUserFromChat(pair1.info);

					const newUsername = testData()
						.fromRandom()
						.data.username.username();
					pair2.info.username = newUsername;

					//Change username for user1
					await user1.pages.profilePage.navigate();
					await user1.pages.profilePage
						.steps()
						.changeUsername(newUsername);

					// Send a new message as user1
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisible(
							pair2.message,
							pair2.info,
						);

					// Assert newly sent message from user1 is not visible as user2
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisible(pair2.info);
				},
			);
		});

		test.describe(`Unignoring an ignored user`, () => {
			test(
				`Unignoring an ignored user`,
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
					await user1.pages.chat.expandChat();
					await user1.pages.chat.steps().sendMessage(pair1.message);

					// As user2 find the chat message and ignore user1
					await user2.pages.homePage.navigate();
					await user2.pages.chat.expandChat();
					await user2.pages.chat
						.steps()
						.ignoreUserFromChat(pair1.info);
					await user2.pages.chat
						.assertThat()
						.messageIsNotVisible(pair1.info);

					// As user2 unignore user1
					await user2.pages.privacyPage.navigate();
					await user2.pages.privacyPage.clickUnignoreUser(
						user1Username,
					);
					await user2.pages.unblockUserModal.clickUnblockButton();
					await user2.pages.chat
						.assertThat()
						.isMessageVisible(pair1.info);

					// Send a new message as user1
					await user1.pages.chat
						.steps()
						.sendMessageAndVerifyItsVisible(
							pair2.message,
							pair2.info,
						);

					// Assert newly sent message from user1 is visible as user2
					await user2.pages.chat
						.assertThat()
						.isMessageVisible(pair2.info);
				},
			);
		});
	},
);
