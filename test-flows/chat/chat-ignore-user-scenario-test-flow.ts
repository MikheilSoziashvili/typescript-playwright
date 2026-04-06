import { BaseTestFlow, testFlow } from "@test-flows";
import { testData } from "test-data/test-data-manager";
import {
	ChatIgnoreUserSetupFlow,
	IgnoreUserSetupResult,
} from "./chat-ignore-user-setup-test-flow";

export class ChatIgnoreUserScenarioFlow extends BaseTestFlow {
	constructor(private readonly setupFlow: ChatIgnoreUserSetupFlow) {
		super();
	}

	@testFlow("Ignore user from chat menu and verify messages are hidden")
	public async ignoreUserFromChatMenuAndVerify(): Promise<void> {
		const {
			user1,
			user2,
			user1Username,
			pair1,
			pair2,
			tipUserInfoMessage,
		}: IgnoreUserSetupResult =
			await this.setupFlow.setupSessionsAndSendMessage();

		await user2.pages.homePage.navigate();
		await user2.pages.chat.expandChat();
		await user2.pages.chat.assertThat().isMessageVisible(pair1.info);
		await user2.pages.chat.steps().ignoreUserFromChat(pair1.info);
		await user2.pages.chat
			.assertThat()
			.isInfoMessageVisible(tipUserInfoMessage, user1Username);
		await user2.pages.chat.assertThat().messageIsNotVisible(pair1.info);

		await user1.pages.chat
			.steps()
			.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);
		await user2.pages.chat.assertThat().messageIsNotVisible(pair2.info);

		await user2.pages.privacyPage.navigate();
		await user2.pages.privacyPage.assertThat().userIsIgnored(user1Username);
	}

	@testFlow(
		"Ignore user and verify messages remain hidden after username change",
	)
	public async ignoreUserAndVerifyAfterUsernameChange(): Promise<void> {
		const { user1, user2, pair1, pair2 }: IgnoreUserSetupResult =
			await this.setupFlow.setupSessionsAndSendMessage();

		await user2.pages.homePage.navigate();
		await user2.pages.chat.expandChat();
		await user2.pages.chat.steps().ignoreUserFromChat(pair1.info);

		const newUsername = testData().fromRandom().data.username.username();
		pair2.info.username = newUsername;

		await user1.pages.profilePage.navigate();
		await user1.pages.profilePage.steps().changeUsername(newUsername);

		await user1.pages.chat
			.steps()
			.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);
		await user2.pages.chat.assertThat().messageIsNotVisible(pair2.info);
	}

	@testFlow("Ignore user via avatar click and verify messages are hidden")
	public async ignoreUserViaAvatarClickAndVerify(): Promise<void> {
		const { user2, user1Username, pair1 }: IgnoreUserSetupResult =
			await this.setupFlow.setupSessionsAndSendMessage();

		await user2.pages.homePage.navigate();
		await user2.pages.chat.expandChat();
		await user2.pages.chat.assertThat().isMessageVisible(pair1.info);
		await user2.pages.chat.steps().openUserProfileModal(pair1.info);
		await user2.pages.userProfileModal.assertThat().isDisplayed();
		await user2.pages.userProfileModal.clickIgnoreButton();

		await user2.pages.privacyPage.navigate();
		await user2.pages.privacyPage.assertThat().userIsIgnored(user1Username);

		await user2.pages.homePage.navigate();
		await user2.pages.chat.expandChat();
		await user2.pages.chat.assertThat().messageIsNotVisible(pair1.info);
	}

	@testFlow("Unignore user and verify messages are visible again")
	public async unignoreUserAndVerify(): Promise<void> {
		const { user1, user2, user1Username, pair1, pair2 }: IgnoreUserSetupResult =
			await this.setupFlow.setupSessionsAndSendMessage();

		await user2.pages.homePage.navigate();
		await user2.pages.chat.expandChat();
		await user2.pages.chat.steps().ignoreUserFromChat(pair1.info);
		await user2.pages.chat.assertThat().messageIsNotVisible(pair1.info);

		await user2.pages.privacyPage.navigate();
		await user2.pages.privacyPage.clickUnignoreUser(user1Username);
		await user2.pages.unblockUserModal.clickUnblockButton();
		await user2.pages.chat.assertThat().isMessageVisible(pair1.info);

		await user1.pages.chat
			.steps()
			.sendMessageAndVerifyItsVisible(pair2.message, pair2.info);
		await user2.pages.chat.assertThat().isMessageVisible(pair2.info);
	}
}
