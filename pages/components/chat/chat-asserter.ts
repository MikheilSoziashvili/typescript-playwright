import { expect } from "@playwright/test";
import { BaseAsserter } from "base/base-asserter";
import { Chat } from "./chat";
import { ChatFooterPlaceholders } from "enums/chat-footer-palceholders";
import { ChatMessageOptions } from "./chat-map";
import { Timeout } from "enums/timeout";

export class ChatAsserter extends BaseAsserter<Chat> {
	public constructor(chat: Chat) {
		super(chat);
	}

	public async isDisplayed(): Promise<void> {
		await expect.soft(this.gamdomPage.map.chatLocator).toBeVisible();
	}

	public async isPlaceholderVisible(
		placeholder: ChatFooterPlaceholders,
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.chatTextBoxPlaceholder)
			.toHaveText(placeholder, { timeout: Timeout.SHORT });
	}

	public async isMessageVisible(
		messageInfo: ChatMessageOptions,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.messageLocator(messageInfo),
		).toBeVisible();
	}

	public async isInfoMessageVisible(
		infoMessage: string,
		index?: number,
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.infoMessageLocator(index))
			.toHaveText(infoMessage);
	}
}
