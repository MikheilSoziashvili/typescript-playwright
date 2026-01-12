import { ChatMessageOptions } from "@pages/components/chat/chat-map";

export interface ChatMessagePair {
	message: string;
	info: ChatMessageOptions;
}

export interface IgnoreUserScenarioData {
	messagePairs: ChatMessagePair[];
	tipUserInfoMessage: string;
}
