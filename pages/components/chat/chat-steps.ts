import { waitUntil } from "@core/utils/utils";
import { CommonUserPopupOption } from "@enums/common-user-popup-options";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";
import { TipUserModal } from "@modals/tip-user-modal/tip-user-modal";
import { BaseComponentStep } from "@pages/base/base-component-step";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { AuthenticatedHeader } from "../header/authenticated/authenticated-header";
import { Chat } from "./chat";
import { ChatMessageOptions } from "./chat-map";
import { FAQ_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { CommonUserOptionsPopup } from "../popups/common-user-options-popup";

export class ChatSteps extends BaseComponentStep<Chat> {
	private authenticatedHeader: AuthenticatedHeader;
	private commonUserOptionsPopup: CommonUserOptionsPopup;

	public constructor(component: Chat) {
		super(component);
		this.authenticatedHeader = this.createAuthenticatedHeader();
		this.commonUserOptionsPopup = new CommonUserOptionsPopup(
			this.component.page,
		);
	}

	private createAuthenticatedHeader(): AuthenticatedHeader {
		return new AuthenticatedHeader(this.component.page);
	}

	@step("Verify chat and send message")
	public async verifyChatAndSendMessage(message: string): Promise<void> {
		await this.component.assertThat().chatIsDisplayed();
		await this.sendMessage(message);
	}

	@step("Open tip user modal")
	public async openTipUserModal(
		options?: ChatMessageOptions,
		isWithVerification = true,
	): Promise<void> {
		const messageUserLevel =
			this.component.map.messageActionsTrigger(options);
		await this.component.map.waitForVisibility({
			locator: messageUserLevel,
		});

		await messageUserLevel.click();

		await this.commonUserOptionsPopup.assertThat().isDisplayed();
		await this.commonUserOptionsPopup.clickOption(
			CommonUserPopupOption.TIP_USER,
		);

		if (isWithVerification) {
			const tipUserModal = new TipUserModal(this.component.page);
			await tipUserModal.assertThat().isDisplayed();
		}
	}

	@step("Verify message and open tip user modal")
	public async verifyMessageAndOpenTipUserModal(
		chatMessage: ChatMessageOptions,
		isWithVerification = true,
	): Promise<void> {
		await this.component.assertThat().isMessageVisible(chatMessage);
		await this.openTipUserModal(chatMessage, isWithVerification);
	}

	@step("Wait upon rain and claim")
	public async waitUponRainAndClaim(): Promise<void> {
		await waitUntil(
			async () => this.component.assertThat().isRainClaimVisible(),
			{
				errorMessage: "Rain claim button did not appear in time",
				timeoutSeconds:
					TimeoutSeconds.THIRTY + TimeoutSeconds.ONE_TWENTY,
				intervalSeconds: 2,
			},
		);

		await this.component.claimRain();
		logger.info("Rain claimed.");
	}

	@step("Select chatroom successfully")
	public async selectChatroomSuccessfully(
		chatroomName: string,
	): Promise<void> {
		await this.component.selectChatroom(chatroomName.toLocaleLowerCase());
		await this.component.assertThat().chatroomIsSelected(chatroomName);
	}

	@step("Verify chat is displayed and message is visible")
	public async verifyChatIsDisplayedAndMessageIsVisible(
		chatMessage: ChatMessageOptions,
	): Promise<void> {
		await this.component.assertThat().chatIsDisplayed();
		await this.component.assertThat().isMessageVisible(chatMessage);
	}

	@step("Toggle pin message")
	private async togglePinMessage(
		action:
			| CommonUserPopupOption.PIN_MESSAGE
			| CommonUserPopupOption.UNPIN_MESSAGE,
		options?: ChatMessageOptions,
	): Promise<void> {
		if (action === CommonUserPopupOption.PIN_MESSAGE) {
			await this.component.closeAllPinnedMessages();
		}

		const targetAvatar =
			action === CommonUserPopupOption.UNPIN_MESSAGE
				? this.component.map.pinnedMessageAvatar(options)
				: this.component.map.messageUserAvatar(options);

		await targetAvatar.click();

		await this.commonUserOptionsPopup.clickOption(action);
	}

	@step("Pin a message in the chat")
	public async pinMessage(options: ChatMessageOptions): Promise<void> {
		await this.togglePinMessage(CommonUserPopupOption.PIN_MESSAGE, options);
	}

	@step("Unpin a message in the chat and assert its unpinned")
	public async unpinMessage(options: ChatMessageOptions): Promise<void> {
		await this.togglePinMessage(
			CommonUserPopupOption.UNPIN_MESSAGE,
			options,
		);
		await this.component.assertThat().messageIsUnpinned(options);
	}

	@step("Send a message and verify it is visible")
	public async sendMessageAndVerifyItsVisible(
		message: string,
		messageInfo: ChatMessageOptions,
	): Promise<void> {
		await this.sendMessage(message);
		await this.component.assertThat().isMessageVisible(messageInfo);
	}

	@step("Send message")
	public async sendMessage(message: string): Promise<void> {
		const maxRetries = 3;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				await this.sendMessageAttempt(message);
				return;
			} catch (error) {
				const isLastAttempt = attempt === maxRetries;
				const isTimeout =
					error instanceof Error && error.name === "TimeoutError";

				if (!isTimeout || isLastAttempt) {
					throw error;
				}

				logger.info(`Retrying sendMessage. Attempt ${attempt}`);
				await this.component.expandChat();
			}
		}
	}

	@step("Send message attempt")
	private async sendMessageAttempt(message: string): Promise<void> {
		await this.component.map.waitForAttributeToHaveValue(
			this.component.map.chatTextBox,
			Attributes.CONTENTEDITABLE,
			BooleanValueString.TRUE,
			Timeout.LONG,
		);

		await this.component.map.chatTextBox.clear();
		await this.component.map.chatTextBox.click();
		await this.component.map.chatTextBox.pressSequentially(message, {
			delay: 30,
		});

		await expect
			.poll(
				async () => {
					await this.component.map.sendMessageButton.click();
					const currentMessage =
						await this.component.map.chatTextBox.innerText();
					return currentMessage.trim() !== message.trim();
				},
				{
					message:
						"Message was not sent successfully after multiple click attempts",
					timeout: Timeout.EXTRA_LONG,
				},
			)
			.toBeTruthy();
	}

	@step("Ignore user from chat")
	public async ignoreUserFromChat(
		options?: ChatMessageOptions,
	): Promise<void> {
		const messageUserLevel =
			this.component.map.messageActionsTrigger(options);
		await this.component.map.waitForVisibility({
			locator: messageUserLevel,
		});

		await messageUserLevel.click();

		await this.commonUserOptionsPopup.assertThat().isDisplayed();
		await this.commonUserOptionsPopup.clickOption(
			CommonUserPopupOption.IGNORE,
		);
	}

	@step("Open user profile modal")
	public async openUserProfileModal(
		options?: ChatMessageOptions,
	): Promise<void> {
		const messageUserLevel = this.component.map.messageUserAvatar(options);
		await this.component.map.waitForVisibility({
			locator: messageUserLevel,
		});
		await messageUserLevel.click();
	}

	@step("Rain claim button redirects to FAQ page")
	public async rainClaimButtonRedirectsToFaq(): Promise<void> {
		await this.component.map.claimRainButton.click();
		await this.commonUserOptionsPopup.page.waitForURL(
			`**${FAQ_PAGE_ENDPOINT}`,
		);
	}
}
