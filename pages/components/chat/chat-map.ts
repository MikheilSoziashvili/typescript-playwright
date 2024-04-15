import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export type ChatMessageOptions = {
	index?: number;
	username?: string;
	message?: string;
};

export class ChatMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get chatLocator(): Locator {
		return this.page.locator(
			"div[class*=ChatSection] > div[class*=ChatRooms]",
		);
	}

	public get chatHeader(): Locator {
		return this.chatLocator.locator("div[class*=ChatRoomsHeader]");
	}

	public get chatMessagesContainer(): Locator {
		return this.chatLocator.locator(" > div[class*= ChatMessages-]");
	}

	public get chatMessagesList(): Locator {
		return this.chatMessagesContainer.locator("ul#chat-messages");
	}

	public messageLocator(options?: ChatMessageOptions): Locator {
		if (options?.index) {
			return this.chatMessagesContainer
				.locator("li[class*= MessageSay-]")
				.nth(options.index - 1);
		} else if (options?.username && options.message) {
			return this.chatMessagesContainer
				.locator("li[class*= MessageSay-]")
				.filter({
					hasText: `${options.username}: ${options.message}`,
				})
				.last();
		} else {
			return this.chatMessagesContainer
				.locator("li[class*= MessageSay-]")
				.last();
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
		if (index) {
			return this.chatMessagesList
				.locator("li[class*= MessageMix-] span[class*= client-message]")
				.nth(index - 1);
		} else {
			return this.chatMessagesList
				.locator("li[class*= MessageMix-] span[class*= client-message]")
				.last();
		}
	}

	public get chatFooter(): Locator {
		return this.chatLocator.locator("div[class*=ChatRoomsFooter]");
	}

	public get chatTextBox(): Locator {
		return this.chatFooter.locator("div[role=textbox]");
	}

	public get chatTextBoxPlaceholder(): Locator {
		return this.chatFooter.locator("span[data-slate-placeholder]");
	}

	public get sendMessageButton(): Locator {
		return this.chatFooter.locator("button[aria-label=send-message]");
	}
}
