import {
	MAILINATOR_EMAIL_ENDPOINT,
	MAILINATOR_MESSAGES_ENDPOINT,
} from "@constants/mailinator-endpoints";
import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";

interface MessagePart {
	body: string;
}

interface Message {
	id: string;
	subject: string;
	parts: MessagePart[];
}

interface MessagesResponse {
	msgs: Message[];
}

interface EmailResponse {
	id: string;
	from: string;
	seconds_ago: number;
	headers: Record<string, string>;
}

export class MailinatorApi extends BaseApi {
	private headers: Record<string, string> = {};

	constructor(
		mailinatorConfig: Record<string, string> = Configuration.mailinator,
	) {
		super(mailinatorConfig.baseUrl);
		this.headers = {
			Authorization: `Bearer ${mailinatorConfig.apiKey}`,
			"Content-Type": "application/json",
		};
	}

	private async fetchMailinator<T>(endpoint: string): Promise<T> {
		const response = await this.get({
			endpoint: endpoint,
			headers: this.headers,
		});

		if (!response.ok()) {
			throw new Error(
				`Failed to fetch ${endpoint}: ${response.statusText()}`,
			);
		}

		return response.json() as T;
	}

	async getMessages(): Promise<Message[]> {
		const messagesResponse: MessagesResponse =
			await this.fetchMailinator<MessagesResponse>(
				MAILINATOR_MESSAGES_ENDPOINT,
			);

		return messagesResponse["msgs"];
	}

	async countMessages(): Promise<number> {
		const messages = await this.getMessages();

		return messages.length;
	}

	async getEmail(emailId: string): Promise<EmailResponse> {
		const emailResponse: EmailResponse = await this.fetchMailinator(
			`${MAILINATOR_EMAIL_ENDPOINT}/${emailId}`,
		);

		return emailResponse;
	}
}
