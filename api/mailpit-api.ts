import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import {
	MailpitMessage,
	MailpitMessageSummary,
	MailpitSearchResponse,
} from "@core/api/interfaces/mailpit-interfaces";
import {
	MAILPIT_MESSAGE_ENDPOINT,
	MAILPIT_MESSAGES_ENDPOINT,
	MAILPIT_SEARCH_ENDPOINT,
} from "@constants/mailpit-endpoints";
import { htmlHrefLinkPattern } from "@support/regex-patterns";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { waitUntil } from "@core/utils/utils";

/**
 * API client for Mailpit — the test email service used to capture and inspect
 * outbound emails sent to `@gamdomemail.com` addresses during E2E tests.
 *
 * Authenticates via OAuth2 proxy bypass using a K8s service account JWT
 * (`OAUTH2_JWT` env var). Base URL defaults to `Configuration.mailpit.baseUrl`.
 */
export class MailpitApi extends BaseApi {
	constructor(baseUrl: string = Configuration.mailpit.baseUrl) {
		super(baseUrl);
		this.setHeaders({
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
	}

	/**
	 * Returns all messages addressed to the given email (up to 50).
	 */
	public async searchMessages(
		email: string,
	): Promise<MailpitMessageSummary[]> {
		const params = this.buildParameters(MAILPIT_SEARCH_ENDPOINT);
		params.queryParams = { query: `to:${email}`, limit: "50" };
		const response = await this.get(params);
		const data = (await response.json()) as MailpitSearchResponse;
		return data.messages;
	}

	/**
	 * Fetches the full message body for a given message ID.
	 */
	public async getMessage(messageId: string): Promise<MailpitMessage> {
		const params = this.buildParameters(
			MAILPIT_MESSAGE_ENDPOINT(messageId),
		);
		const response = await this.get(params);
		return (await response.json()) as MailpitMessage;
	}

	/**
	 * Extracts all `href` URLs from the HTML body of the given message.
	 */
	public async getMessageLinks(messageId: string): Promise<string[]> {
		const message = await this.getMessage(messageId);
		return [...message.HTML.matchAll(htmlHrefLinkPattern)]
			.map((match) => match[1])
			.filter(Boolean);
	}

	/**
	 * Deletes messages by ID. If no IDs are provided, deletes all messages.
	 */
	public async deleteMessages(ids?: string[]): Promise<void> {
		const body = ids ? { IDs: ids } : undefined;
		await this.delete(
			this.buildParameters(MAILPIT_MESSAGES_ENDPOINT, body),
		);
	}

	/**
	 * Polls until at least `messageIndex` messages arrive for the given email.
	 * Optionally filters by subject substring before checking the count.
	 *
	 * @param email - Full recipient address to search for.
	 * @param timeout - Maximum wait time in seconds.
	 * @param interval - Polling interval in seconds.
	 * @param messageIndex - 1-based position of the expected message.
	 * @param subjectIncludes - Optional subject substring filter.
	 */
	public async pollForMessages(
		email: string,
		timeout = TimeoutSeconds.FIVE,
		interval = TimeoutSeconds.ONE,
		messageIndex = 1,
		subjectIncludes?: string,
	): Promise<MailpitMessageSummary> {
		let result: MailpitMessageSummary | undefined;

		await waitUntil(
			async () => {
				const messages = await this.searchMessages(email);
				const filtered = subjectIncludes
					? messages.filter((msg) =>
							msg.Subject.toLowerCase().includes(
								subjectIncludes.toLowerCase(),
							),
						)
					: messages;
				if (filtered.length >= messageIndex) {
					result = filtered[messageIndex - 1];
					return true;
				}
				return false;
			},
			{
				errorMessage: `No message found for ${email}`,
				intervalSeconds: interval,
				timeoutSeconds: timeout,
			},
		);

		if (!result) {
			throw new Error(`No message found for ${email}`);
		}

		return result;
	}
}
