import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { Chat } from "./chat";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { ChatMessageOptions } from "./chat-map";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";

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
			{ timeout: Timeout.MAX }, // To be removed when issues with e2e environment are resolved
		);
	}

	// TODO: [ENG-2417] Investigate chat loading issue (tip user test) when trying to read a message
	// Temporary workaround: Polling for message visibility should be removed after the issue is resolved
	public async isMessageVisible(
		messageInfo: ChatMessageOptions,
	): Promise<void> {
		const retries = 3;
		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				await expect(
					this.gamdomPage.map.messageLocator(messageInfo),
				).toBeVisible();

				logger.info(
					`Message from "${messageInfo.username}" with text "${messageInfo.message}" is successfully visible.`,
				);

				break;
			} catch (error) {
				if (attempt === retries) {
					throw error;
				}

				logger.info(
					`Message is not visible. Attempt ${attempt} failed.\nReloading the page and retrying to read the message...`,
				);

				await this.gamdomPage.page.reload();
			}
		}
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
