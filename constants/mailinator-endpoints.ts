export const MAILINATOR_BASE_URL = (baseUrl: string): string =>
	`${baseUrl}/domains`;

export const MAILINATOR_INBOX_URL = (
	baseUrl: string,
	domain: string,
	inbox: string,
): string => `${MAILINATOR_BASE_URL(baseUrl)}/${domain}/inboxes/${inbox}`;

export const MAILINATOR_MESSAGE_URL = (
	baseUrl: string,
	domain: string,
	inbox: string,
	messageId: string,
): string =>
	`${MAILINATOR_INBOX_URL(baseUrl, domain, inbox)}/messages/${messageId}`;

export const MAILINATOR_MESSAGE_LINKS_URL = (
	baseUrl: string,
	domain: string,
	inbox: string,
	messageId: string,
): string =>
	`${MAILINATOR_INBOX_URL(
		baseUrl,
		domain,
		inbox,
	)}/messages/${messageId}/links`;
