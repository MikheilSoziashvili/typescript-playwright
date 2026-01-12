import { buildIgnoreUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import { buildMessagePairs } from "@core/utils/utils";
import { IgnoreUserScenarioData } from "test-data/interfaces/domain/chat-domain-interfaces";

export class ChatDomainData {
	public buildIgnoreUserScenarioData(
		ignoredUsername: string,
	): IgnoreUserScenarioData {
		const messagePairs = buildMessagePairs(ignoredUsername);

		const tipUserInfoMessage = buildIgnoreUserMessageInfo({
			ignoredUser: ignoredUsername,
		});

		return {
			messagePairs: messagePairs,
			tipUserInfoMessage: tipUserInfoMessage,
		};
	}
}
