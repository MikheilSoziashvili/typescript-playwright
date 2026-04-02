export const MAILPIT_SEARCH_ENDPOINT = "/api/v1/search";

export const MAILPIT_MESSAGE_ENDPOINT = (messageId: string): string =>
	`/api/v1/message/${messageId}`;

export const MAILPIT_MESSAGES_ENDPOINT = "/api/v1/messages";
