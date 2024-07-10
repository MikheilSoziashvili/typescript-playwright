import {
	MAILINATOR_EMAIL_ENDPOINT,
	MAILINATOR_MESSAGES_ENDPOINT,
} from "@constants/mailinator-endpoints";
import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import {
	Message,
	MessagesResponse,
	EmailResponse,
} from "../core/api/interfaces/mailinator-interfaces";

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
		const response = await this.get({
			endpoint: endpoint,
		});

		if (!response.ok()) {
			throw new Error(
				`Failed to fetch ${endpoint}: ${response.statusText()}`,
			);
		}

		return response.json() as T;
	}

	public async getMessages(): Promise<Message[]> {
		const messagesResponse = await this.fetchMailinator<MessagesResponse>(
			MAILINATOR_MESSAGES_ENDPOINT,
		);

		return messagesResponse.msgs;
	}

	public async countMessages(): Promise<number> {
		const messages = await this.getMessages();
		return messages.length;
	}

	public async getEmail(emailId: string): Promise<EmailResponse> {
		return this.fetchMailinator<EmailResponse>(
			`${MAILINATOR_EMAIL_ENDPOINT}/${emailId}`,
		);
	}
}
