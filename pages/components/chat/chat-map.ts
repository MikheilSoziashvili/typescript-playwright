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

	public get chatHeaderButton(): Locator {
		return this.page
			.getByTestId("headerContainer")
			.getByTestId("iconChatButton");
	}

	public get chatOpenedStateContainer(): Locator {
		return this.page.locator("[data-testid*=chatSectionContainer-]");
	}

	public get chatOpenedContainerLocator(): Locator {
		return this.page.getByTestId("chatSectionContainer-open");
	}

	public get chatClosedContainerLocator(): Locator {
		return this.page.getByTestId("chatSectionContainer-closed");
	}

	public get chatMessagesContainer(): Locator {
		return this.chatLocator.getByTestId("chatMessagesContainer");
	}

	public get chatMessagesConnecting(): Locator {
		return this.chatLocator.getByTestId("chatMessages-connecting");
	}

	public get chatMessagesJoining(): Locator {
		return this.chatLocator.getByTestId("chatMessages-joining");
	}

	public get chatMessagesDisconnected(): Locator {
		return this.chatLocator.getByTestId("chatMessages-disconnected");
	}

	public get chatMessagesWithContent(): Locator {
		return this.chatLocator.getByTestId("chatMessages-withContent");
	}

	public get chatMessagesEmpty(): Locator {
		return this.chatLocator.getByTestId("chatMessages-empty");
	}

	public get pinnedLocator(): Locator {
		return this.chatMessagesList.locator(
			`li[data-testid*="messagePinned-container-"]`,
		);
	}

	public pinnedMessageLocator(options?: ChatMessageOptions): Locator {
		if (options?.index) {
			return this.pinnedLocator.nth(options.index - 1);
		} else if (options?.username && options.message) {
			return this.pinnedLocator
				.filter({ hasText: options.username })
				.filter({ hasText: options.message })
				.last();
		} else {
			return this.pinnedLocator.last();
		}
	}

	public get pinnedMessagesContainer(): Locator {
		return this.page.locator('ul[class*="PinnedChatMessageContainer"]');
	}

	public pinnedMessageAvatar(options?: ChatMessageOptions): Locator {
		return this.pinnedMessageLocator(options).locator(
			'[data-testid*="messagePinned-userProfile"]',
		);
	}

	public pinnedMessageCloseButton(options?: ChatMessageOptions): Locator {
		return this.pinnedMessageLocator(options).locator(
			'[data-testid*="messagePinned-closeButton-"]',
		);
	}

	public get allPinnedCloseButtons(): Locator {
		return this.pinnedLocator.locator(
			'[data-testid*="messagePinned-closeButton-"]',
		);
	}

	public diamondIcon(options?: ChatMessageOptions): Locator {
		return this.messageLocator(options).locator(
			`[data-testid*="messageSay-vipIcon"]`,
		);
	}

	public get vipTooltip(): Locator {
		return this.page.locator("role=tooltip >> p");
	}

	/**
	 * Returns the N-th chat message that contains `text`.
	 *
	 * @param expectedText        A unique substring (e.g. "hello").
	 * @param occurrence  0 = first match, 1 = second … ;  -1 (default) = latest.
	 */
	public infoMessageByText(expectedText: string, occurrence = -1): Locator {
		const matches = this.infoMessages.filter({ hasText: expectedText });
		return occurrence === -1 ? matches.last() : matches.nth(occurrence);
	}

	public get rainBotMessageContainer(): Locator {
		return this.page.locator(`li[data-testid*="messageRain-container-"]`);
	}

	public get rainBotMessageLocator(): Locator {
		return this.rainBotMessageContainer.locator(
			`[data-testid*="messageRain-message"]`,
		);
	}

	public get rainTransitionGroupContainer(): Locator {
		return this.page.getByTestId(`rainBox-transitionGroup`);
	}

	public get claimRainButton(): Locator {
		return this.rainTransitionGroupContainer.locator(
			`[data-testid*="claimRain-button"] [data-testid*="claimRain-buttonText"]`,
		);
	}

	public get lastRainbotMessageUserCount(): Locator {
		return this.rainBotMessageLocator.last();
	}

	public get rainClaimedMessageLocator(): Locator {
		return this.rainTransitionGroupContainer.locator(
			`[data-testid*="rainBox-message"]`,
		);
	}

	public get chatTextBoxPlaceholder(): Locator {
		return this.chatFooter.getByTestId("chat-input-placeholder");
	}

	public get chatroomsDropdownContainer(): Locator {
		return this.page.getByTestId(`ListContainer`);
	}

	public chatroomDropdownOption(value: string): Locator {
		return this.getDropdownOptionSelector(
			value,
			this.chatroomsDropdownContainer,
		);
	}

	public get chatroomsDropdownSelectedValue(): Locator {
		return this.chatHeader.getByTestId("Input");
	}

	public get chatButton(): Locator {
		return this.page.getByTestId("chat-toggle-btn");
	}

	public get chatFooter(): Locator {
		return this.chatLocator.getByTestId("chat-footer");
	}

	public get chatTextBox(): Locator {
		return this.chatFooter.getByTestId("chat-input-editable");
	}

	public get sendMessageButton(): Locator {
		return this.chatFooter.getByTestId("chat-input-send-button");
	}

	public get chatLocator(): Locator {
		return this.page.getByTestId("chat-container");
	}

	public get chatHeader(): Locator {
		return this.chatLocator.getByTestId("chat-header");
	}

	public get chatMessagesList(): Locator {
		return this.chatLocator.getByTestId("chat-messages");
	}

	public get chatMessagesWithContentList(): Locator {
		return this.chatMessagesList.getByTestId("chatMessages-withContent");
	}

	public get usernameInMessage(): Locator {
		return this.page.locator(
			'[data-testid^="message-say-"][data-testid$="-chatUserName-inner"]',
		);
	}

	public get textInMessage(): Locator {
		return this.page.locator(
			'[data-testid^="message-say-"][data-testid$="-messageContainer"]',
		);
	}

	public messageLocator(options?: ChatMessageOptions): Locator {
		const messageLocator = this.chatMessagesWithContentList.locator(
			'li[data-testid^="message-say-"][data-testid$="-container"]',
		);
		if (options?.index) {
			return messageLocator.nth(options.index - 1);
		} else if (options?.username && options.message) {
			return messageLocator
				.filter({
					has: this.usernameInMessage.filter({
						hasText: options.username,
					}),
				})
				.filter({
					has: this.textInMessage.filter({
						hasText: options.message,
					}),
				})
				.last();
		} else {
			return messageLocator.last();
		}
	}

	public messageActionsTrigger(options?: ChatMessageOptions): Locator {
		return this.messageLocator(options).locator(
			'[data-testid^="message-say-"][data-testid$="-messageActionsTrigger"]',
		);
	}

	public get infoMessageContainer(): Locator {
		return this.chatMessagesWithContentList.locator(
			'[data-testid^="message-client_message-"][data-testid$="-client_message"]',
		);
	}

	public get infoMessages(): Locator {
		return this.infoMessageContainer.locator(
			'[data-testid$="-client_message-text"]',
		);
	}

	public infoMessageLocator(index?: number): Locator {
		const infoLocator = this.infoMessages;
		if (index) {
			return infoLocator.nth(index - 1);
		}
		return infoLocator;
	}

	public messageUserAvatar(options?: ChatMessageOptions): Locator {
		return this.messageLocator(options).locator(
			'[data-testid^="message-say-"][data-testid$="-avatar"]',
		);
	}
}
