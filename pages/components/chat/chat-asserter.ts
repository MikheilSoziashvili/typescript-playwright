import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { Chat } from "./chat";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { ChatMessageOptions } from "./chat-map";

export class ChatAsserter extends BaseAsserter<Chat> {
	public constructor(chat: Chat) {
		super(chat);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.chatLocator).toBeVisible();
	}

	public async isPlaceholderVisible(
		placeholder: ChatFooterPlaceholder,
	): Promise<void> {
		await expect(this.gamdomPage.map.chatTextBoxPlaceholder).toHaveText(
			placeholder,
		);
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
		await expect(this.gamdomPage.map.infoMessageLocator(index)).toHaveText(
			infoMessage,
		);
	}
}
