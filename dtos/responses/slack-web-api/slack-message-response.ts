export interface SlackMessageResponse {
	type: string;
	text: string;
	user?: string;
	ts: string;
	bot_id?: string;
	username?: string;
	thread_ts?: string;
}
