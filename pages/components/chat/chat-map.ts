import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export type ChatMessageOptions = {
	index?: number;
	username: string;
	message?: string;
};

export class ChatMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get chatLocator(): Locator {
		return this.page.getByTestId("chatSection");
	}

	public get chatHeader(): Locator {
		return this.chatLocator.getByTestId("chatHeader");
	}

	public get chatMessagesList(): Locator {
		return this.chatLocator.locator("ul#chat-messages");
	}

	public messageLocator(options?: ChatMessageOptions): Locator {
		const messageLocator = this.chatMessagesList.locator(
			"li[class*= MessageSay-]",
		);
		if (options?.index) {
			return messageLocator.nth(options.index - 1);
		} else if (options?.username && options.message) {
			return messageLocator
				.filter({
					hasText: `${options.username}:`,
				})
				.filter({
					hasText: `${options.message}`,
				})
				.last();
		} else {
			return messageLocator.last();
		}
	}

	public messageUserLevel(options?: ChatMessageOptions): Locator {
		return this.messageLocator(options).locator(
			"span[class*= LevelButtonArea] div[class*=_FlexContainer]",
		);
	}

	public messageUserAvatar(options?: ChatMessageOptions): Locator {
		return this.messageLocator(options).locator(
			"span[class*= UserPofile]:has(img)",
		);
	}

	public infoMessageLocator(index?: number): Locator {
		const infoLocator = this.chatMessagesList.locator(
			"li[class*= MessageMix-] span[class*= client-message]",
		);
		if (index) {
			return infoLocator.nth(index - 1);
		} else {
			return infoLocator.last();
		}
	}

	public get chatFooter(): Locator {
		return this.chatLocator.getByTestId("chatFooter");
	}

	public get chatTextBox(): Locator {
		return this.chatFooter.locator('div > div[class*="chat_inputbox"]');
	}

	public get chatTextBoxPlaceholder(): Locator {
		return this.chatFooter.locator("span[data-slate-placeholder]");
	}

	public get sendMessageButton(): Locator {
		return this.chatFooter.locator("button[aria-label=send-message]");
	}
}
