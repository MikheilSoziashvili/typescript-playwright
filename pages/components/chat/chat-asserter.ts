import { BaseAsserter } from "@base/base-asserter";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import { logger } from "@logger/logger";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { Chat } from "./chat";
import { ChatMessageOptions } from "./chat-map";
import { Timeout } from "@enums/timeout";
import { VipUserStatus } from "@enums/vip-user-statuses";
import { TooltipText } from "@enums/tooltip-text";

export class ChatAsserter extends BaseAsserter<Chat> {
	public constructor(chat: Chat) {
		super(chat);
	}

	@step("Retry with page reload")
	private async retryWithPageReload(
		fn: (attempt: number) => Promise<void>,
		description: string,
		retries: number,
	): Promise<void> {
		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				await fn(attempt);
				logger.info(`${description} succeeded on attempt ${attempt}`);
				return;
			} catch (error) {
				if (attempt === retries) {
					logger.error(
						`${description} failed after ${retries} attempts`,
					);
					throw error;
				}
				logger.warn(
					`${description} failed on attempt ${attempt}, reloading page...`,
				);
				await this.gamdomPage.page.reload();
			}
		}
	}

	@step("Check chat is displayed")
	public async chatIsDisplayed(): Promise<void> {
		await this.chatIsOpenSuccessfully();
		await this.checkElementsAreVisible([this.gamdomPage.map.chatLocator]);
		await this.chatMessagesConnectingIsNotDisplayed();
		await this.chatMessagesJoiningIsNotDisplayed();
		await this.chatMessagesDisconnectedIsNotDisplayed();
	}

	@step("Check chat is opened")
	public async chatIsOpenSuccessfully(): Promise<void> {
		const chatState =
			await this.gamdomPage.map.chatOpenedStateContainer.getAttribute(
				Attributes.DATA_TESTID,
			);
		expect(chatState).toContain(AttributesValues.OPEN);
	}

	@step("Check chat is closed")
	public async chatIsClosedSuccessfully(): Promise<void> {
		const chatState =
			await this.gamdomPage.map.chatOpenedStateContainer.getAttribute(
				Attributes.DATA_TESTID,
			);
		expect(chatState).toContain(AttributesValues.CLOSED);
	}

	@step("Check placeholder is visible")
	public async isPlaceholderVisible(
		placeholder: ChatFooterPlaceholder,
	): Promise<void> {
		await expect(this.gamdomPage.map.chatTextBoxPlaceholder).toBeVisible({
			timeout: Timeout.MAX,
		});
		await expect(this.gamdomPage.map.chatTextBoxPlaceholder).toHaveText(
			placeholder,
			{ timeout: Timeout.MAX }, // To be removed when issues with e2e environment are resolved
		);
	}

	@step("Check message is visible")
	public async isMessageVisible(
		messageInfo: ChatMessageOptions,
		retries = 3,
	): Promise<void> {
		const locator = this.gamdomPage.map.messageLocator(messageInfo);
		await this.retryWithPageReload(
			(_attempt) => this.checkElementsAreVisible([locator]),
			`Message from "${messageInfo.username}" with text "${messageInfo.message}" is visible`,
			retries,
		);
		await expect(locator).toBeAttached();
	}

	@step("Check message is pinned and is visible")
	public async isPinnedMessageVisible(
		messageInfo: ChatMessageOptions,
		retries = 3,
	): Promise<void> {
		const locator = this.gamdomPage.map.pinnedMessageLocator(messageInfo);
		await this.retryWithPageReload(
			(_attempt) => this.checkElementsAreVisible([locator]),
			`Pinned message from "${messageInfo.username}" with text "${messageInfo.message}" is visible`,
			retries,
		);
		await expect(locator).toBeAttached();
	}

	@step("Verify VIP diamond icon is displayed for message author")
	public async vipDiamondIsVisibleForMessageAuthor(
		messageInfo: ChatMessageOptions,
		vipStatus: string,
		retries = 3,
	): Promise<void> {
		const message = this.gamdomPage.map.messageLocator(messageInfo);
		const diamondIcon = this.gamdomPage.map.diamondIcon(messageInfo);

		await this.retryWithPageReload(
			async (_attempt) => {
				await this.checkElementsAreVisible([message]);
				if (vipStatus === VipUserStatus.PVIP) {
					await this.checkElementsAreHidden([diamondIcon], {
						message: `VIP diamond icon should be hidden for message "${messageInfo.message}"`,
					});
				} else {
					await this.checkElementsAreVisible([diamondIcon]);
					await diamondIcon.hover();
					await this.checkElementsHaveText([
						{
							locator: this.gamdomPage.map.vipTooltip,
							expectedText: TooltipText.VIP,
						},
					]);
				}
			},
			`VIP diamond icon visibility matches expected state for "${messageInfo.username}" on message "${messageInfo.message}"`,
			retries,
		);
	}

	@step("Check message is not visible")
	public async messageIsNotVisible(
		messageInfo: ChatMessageOptions,
		retries = 3,
	): Promise<void> {
		const locator = this.gamdomPage.map.messageLocator(messageInfo);
		await this.retryWithPageReload(
			(_attempt) => this.checkElementsAreHidden([locator]),
			`Message from "${messageInfo.username}" with text "${messageInfo.message}" is not visible`,
			retries,
		);
	}

	@step("Check info message is visible")
	public async isInfoMessageVisible(
		infoMessage: string,
		username?: string,
		index?: number,
	): Promise<void> {
		let locator = this.gamdomPage.map.infoMessageLocator(index);

		if (username) {
			locator = locator.filter({ hasText: username });
		}

		await expect(locator.last()).toHaveText(infoMessage);
	}

	@step("Check info message is visible by text")
	public async isInfoMessageVisibleByText(
		text: string,
		occurrence = -1,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.infoMessageByText(text, occurrence),
		).toContainText(text);
	}

	@step("Verify rain claim is visible")
	public async isRainClaimVisible(): Promise<boolean> {
		return this.isElementVisible([this.gamdomPage.map.claimRainButton]);
	}

	@step("Verify rain bot message is visible")
	public async isRainBotMessageVisible(): Promise<boolean> {
		return this.isElementVisible([
			this.gamdomPage.map.rainBotMessageLocator,
		]);
	}

	@step("Rain claimed message is displayed")
	public async rainClaimedMessageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.rainClaimedMessageLocator,
		]);
	}

	@step("Chatroom is selected")
	public async chatroomIsSelected(chatroomName: string): Promise<void> {
		await expect(
			this.gamdomPage.map.chatroomsDropdownSelectedValue,
		).toHaveText(chatroomName);
	}

	@step("Chat messages: connecting state is displayed")
	public async chatMessagesConnectingIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.chatMessagesConnecting],
			undefined,
			"Expected chat to be in 'connecting' state, but it is not.",
		);
	}

	@step("Chat messages: joining state is displayed")
	public async chatMessagesJoiningIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.chatMessagesJoining],
			undefined,
			"Expected chat to be in 'joining' state, but it is not.",
		);
	}

	@step("Chat messages: disconnected state is displayed")
	public async chatMessagesDisconnectedIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.chatMessagesDisconnected],
			undefined,
			"Expected chat to be in 'disconnected' state, but it is not.",
		);
	}

	@step("Chat messages: with content state is displayed")
	public async chatMessagesWithContentIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.chatMessagesWithContent],
			undefined,
			"Expected chat to be in 'withContent' state, but it is not.",
		);
	}

	@step("Chat messages: empty state is displayed")
	public async chatMessagesEmptyIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.chatMessagesEmpty],
			undefined,
			"Expected chat to be in 'empty' state, but it is not.",
		);
	}

	@step("Chat messages: connecting state is not displayed")
	public async chatMessagesConnectingIsNotDisplayed(): Promise<void> {
		const connecting = this.gamdomPage.map.chatMessagesConnecting;

		try {
			await this.checkElementsAreNotVisible(
				[connecting],
				Timeout.SHORT,
				"Chat is in 'connecting' state, but it should not be.",
			);
			return;
		} catch {
			await this.gamdomPage.page.reload();
		}

		await this.checkElementsAreNotVisible(
			[connecting],
			Timeout.SHORT,
			"Chat is in 'connecting' state, but it should not be (after refresh).",
		);
	}

	@step("Chat messages: joining state is not displayed")
	public async chatMessagesJoiningIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible(
			[this.gamdomPage.map.chatMessagesJoining],
			undefined,
			"Chat is in 'joining' state, but it should not be.",
		);
	}

	@step("Chat messages: disconnected state is not displayed")
	public async chatMessagesDisconnectedIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible(
			[this.gamdomPage.map.chatMessagesDisconnected],
			undefined,
			"Chat is in 'disconnected' state, but it should not be.",
		);
	}

	@step("Assert that message is unpinned")
	public async messageIsUnpinned(options: ChatMessageOptions): Promise<void> {
		const pinned = this.gamdomPage.map.pinnedMessageLocator(options);
		await expect(pinned).toHaveCount(0);
	}
}
