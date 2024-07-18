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
import { hardWait } from "@core/utils/utils";

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
		const messagesResponse = await this.executeRequest<MessagesResponse>(
			endpoint,
		);
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
		timeout = Timeout.LONG,
		interval = Timeout.EXTRA_SHORT,
		messageIndex = 1,
	): Promise<Message> {
		const start = Date.now();

		while (Date.now() - start < timeout) {
			const messages = await this.getMessages(domain, inbox);
			if (messages.length >= messageIndex) {
				return messages[messageIndex - 1];
			}
			await hardWait(interval);
		}

		throw new Error(
			`Timeout of ${timeout}ms exceeded while polling for messages in ${inbox}`,
		);
	}
}
