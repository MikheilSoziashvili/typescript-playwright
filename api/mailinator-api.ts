import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import {
	Message,
	MessagesResponse,
	EmailResponse,
	EmailLinksResponse,
} from "../core/api/interfaces/mailinator-interfaces";
import {
	MAILINATOR_INBOX_URL,
	MAILINATOR_MESSAGE_URL,
	MAILINATOR_MESSAGE_LINKS_URL,
} from "@constants/mailinator-endpoints";
import { Timeout } from "@enums/timeout";
import { waitUntil } from "@core/utils/utils";

export class MailinatorApi extends BaseApi {
	constructor(
		mailinatorConfig: Record<string, string> = Configuration.mailinator,
	) {
		super(mailinatorConfig.baseUrl);
		this.setHeaders({
			Authorization: `Bearer ${mailinatorConfig.apiKey}`,
			"Content-Type": "application/json",
		});
	}

	private async executeRequest<T>(endpoint: string): Promise<T> {
		const response = await this.get({ endpoint });

		if (!response.ok()) {
			throw new Error(
				`Failed to fetch ${endpoint}: ${response.statusText()}`,
			);
		}

		return response.json() as T;
	}

	public async getMessages(
		domain: string,
		inbox: string,
	): Promise<Message[]> {
		const endpoint = MAILINATOR_INBOX_URL(
			Configuration.mailinator.baseUrl,
			domain,
			inbox,
		);
		const messagesResponse =
			await this.executeRequest<MessagesResponse>(endpoint);
		return messagesResponse.msgs;
	}

	public async countMessages(domain: string, inbox: string): Promise<number> {
		const messages = await this.getMessages(domain, inbox);
		return messages.length;
	}

	public async getEmail(
		domain: string,
		inbox: string,
		messageId: string,
	): Promise<EmailResponse> {
		const endpoint = MAILINATOR_MESSAGE_URL(
			Configuration.mailinator.baseUrl,
			domain,
			inbox,
			messageId,
		);
		return this.executeRequest<EmailResponse>(endpoint);
	}

	public async getEmailLinks(
		domain: string,
		inbox: string,
		messageId: string,
	): Promise<EmailLinksResponse> {
		const endpoint = MAILINATOR_MESSAGE_LINKS_URL(
			Configuration.mailinator.baseUrl,
			domain,
			inbox,
			messageId,
		);
		return this.executeRequest<EmailLinksResponse>(endpoint);
	}

	public async deleteInbox(domain: string, inbox: string): Promise<void> {
		const endpoint = MAILINATOR_INBOX_URL(
			Configuration.mailinator.baseUrl,
			domain,
			inbox,
		);
		await this.delete({ endpoint });
	}

	public async pollForMessages(
		domain: string,
		inbox: string,
		timeout = Timeout.MEDIUM,
		interval = Timeout.SHORT,
		messageIndex = 1,
		subjectIncludes?: string,
	): Promise<Message> {
		let result: Message | undefined;

		await waitUntil(
			async () => {
				const messages = await this.getMessages(domain, inbox);
				const filtered = subjectIncludes
					? messages.filter((msg) =>
							msg.subject
								.toLowerCase()
								.includes(subjectIncludes.toLowerCase()),
						)
					: messages;
				if (filtered.length >= messageIndex) {
					result = filtered[messageIndex - 1];
					return true;
				}
				return false;
			},
			{
				errorMessage: `No message found in inbox ${inbox}`,
				intervalSeconds: interval / 1000,
				timeoutSeconds: timeout / 1000,
			},
		);

		if (!result) {
			throw new Error(`No message found in inbox ${inbox}`);
		}

		return result;
	}
}
