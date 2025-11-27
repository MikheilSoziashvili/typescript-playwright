import { SlackMessageResponse } from "./slack-message-response";

export interface SlackHistoryResponse {
	ok: boolean;
	messages: SlackMessageResponse[];
	has_more?: boolean;
}
