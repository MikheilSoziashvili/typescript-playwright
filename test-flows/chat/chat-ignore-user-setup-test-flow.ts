import { BaseTestFlow, testFlow } from "@test-flows";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { testData } from "test-data/test-data-manager";
import { ChatMessagePair } from "test-data/interfaces/domain/chat-domain-interfaces";

export type IgnoreUserSetupResult = {
	user1: BrowserUserSession;
	user2: BrowserUserSession;
	user1Username: string;
	pair1: ChatMessagePair;
	pair2: ChatMessagePair;
	tipUserInfoMessage: string;
};

export class ChatIgnoreUserSetupFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Log in two users and have user1 send a chat message")
	public async setupSessionsAndSendMessage(): Promise<IgnoreUserSetupResult> {
		const user1 = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{ reuseContext: true },
		);

		const user2 = await this.browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
		);

		const user1Username = user1.getAuthenticatedUser().user.username;

		const { messagePairs, tipUserInfoMessage } = testData()
			.fromDomain()
			.chat.buildIgnoreUserScenarioData(user1Username);

		const [pair1, pair2] = messagePairs;

		await user1.pages.homePage.navigate();
		await user1.pages.chat.expandChat();
		await user1.pages.chat.steps().sendMessage(pair1.message);

		return { user1, user2, user1Username, pair1, pair2, tipUserInfoMessage };
	}
}
