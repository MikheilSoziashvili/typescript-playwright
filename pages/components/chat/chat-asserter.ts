import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { Chat } from "./chat";
import { ChatFooterPlaceholder } from "@enums/chat-footer-palceholders";
import { ChatMessageOptions } from "./chat-map";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { step } from "decorators/step";

export class ChatAsserter extends BaseAsserter<Chat> {
	public constructor(chat: Chat) {
		super(chat);
	}

	@step("Retry wit page reload")
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
		await expect(this.gamdomPage.map.chatLocator).toBeVisible();
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
		index?: number,
	): Promise<void> {
		await expect(this.gamdomPage.map.infoMessageLocator(index)).toHaveText(
			infoMessage,
		);
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
}
