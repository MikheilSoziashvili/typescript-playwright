import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import {
	Message,
	MessagesResponse,
	EmailResponse,
	EmailLinksResponse,
} from "../core/api/interfaces/mailinator-interfaces";

const MAILINATOR_MESSAGES_ENDPOINT = `${Configuration.mailinator.baseUrl}/domains`;

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

	private async fetchMailinator<T>(endpoint: string): Promise<T> {
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
		const endpoint = `${MAILINATOR_MESSAGES_ENDPOINT}/${domain}/inboxes/${inbox}`;
		const messagesResponse = await this.fetchMailinator<MessagesResponse>(
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
		const endpoint = `${MAILINATOR_MESSAGES_ENDPOINT}/${domain}/inboxes/${inbox}/messages/${messageId}`;

		return this.fetchMailinator<EmailResponse>(endpoint);
	}

	public async getEmailLinks(
		domain: string,
		inbox: string,
		messageId: string,
	): Promise<EmailLinksResponse> {
		const endpoint = `${MAILINATOR_MESSAGES_ENDPOINT}/${domain}/inboxes/${inbox}/messages/${messageId}/links`;

		return this.fetchMailinator<EmailLinksResponse>(endpoint);
	}

	public async deleteInbox(domain: string, inbox: string): Promise<void> {
		const endpoint = `${MAILINATOR_MESSAGES_ENDPOINT}/${domain}/inboxes/${inbox}`;
		await this.delete({ endpoint });
	}

	public async pollForMessages(
		domain: string,
		inbox: string,
		timeout = 30000,
		interval = 2000,
	): Promise<Message[]> {
		const start = Date.now();

		while (Date.now() - start < timeout) {
			const messages = await this.getMessages(domain, inbox);
			if (messages.length > 0) {
				return messages;
			}
			await new Promise((resolve) => setTimeout(resolve, interval));
		}

		throw new Error(
			`Timeout of ${timeout}ms exceeded while polling for messages in inbox: ${inbox}`,
		);
	}
}
