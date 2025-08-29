import { waitUntil } from "@core/utils/utils";
import { CommonUserPopupOption } from "@enums/common-user-popup-options";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";
import { TipUserModal } from "@modals/tip-user-modal/tip-user-modal";
import { UserProfileModal } from "@modals/user-profile-modal/user-profile-modal";
import { BaseComponentStep } from "@pages/base/base-component-step";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { AuthenticatedHeader } from "../header/authenticated/authenticated-header";
import { CommonUserOptionsPopup } from "../popups/common-user-options-popup";
import { Chat } from "./chat";
import { ChatMessageOptions } from "./chat-map";

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

	@step("Open chat and verify")
	public async openChatAndVerify(): Promise<void> {
		await this.authenticatedHeader.expandChatIfNotVisible();
		await this.component.assertThat().chatIsDisplayed();
	}

	@step("Verify chat and send message")
	public async verifyChatAndSendMessage(message: string): Promise<void> {
		await this.component.assertThat().chatIsDisplayed();
		await this.sendMessage(message);
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
		let retryCount = 0;
		const maxRetries = 3;

		while (retryCount < maxRetries) {
			try {
				await this.component.map.waitForAttributeToHaveValue(
					this.component.map.chatTextBox,
					Attributes.CONTENTEDITABLE,
					BooleanValueString.TRUE,
					Timeout.LONG,
				);
				await this.component.map.chatTextBox.clear();
				await this.component.map.chatTextBox.click();
				await this.component.map.chatTextBox.pressSequentially(
					message,
					{ delay: 30 },
				);

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
				break;
			} catch (error) {
				const e = error as Error;

				if (e.name === "TimeoutError") {
					logger.info(
						`Retrying sendMessage. Attempt ${retryCount + 1}`,
					);
					retryCount++;

					if (retryCount >= maxRetries) {
						throw e;
					}

					await this.authenticatedHeader.map.chatButton.click();
				} else {
					throw e; // Rethrow non-TimeoutError exceptions in order not to miss another potential issues
				}
			}
		}
	}

	@step("Open tip user modal")
	public async openTipUserModal(
		options?: ChatMessageOptions,
		isWithVerification = true,
	): Promise<void> {
		const messageUserLevel = this.component.map.messageUserAvatar(options);
		await this.component.map.waitForVisibility({
			locator: messageUserLevel,
		});

		await messageUserLevel.click();

		const commonUserOptionsPopup = new CommonUserOptionsPopup(
			this.component.page,
		);
		await commonUserOptionsPopup.assertThat().isDisplayed();

		await commonUserOptionsPopup.clickOption(
			CommonUserPopupOption.TIP_USER,
		);

		if (isWithVerification) {
			const tipUserModal = new TipUserModal(this.component.page);
			await tipUserModal.assertThat().isDisplayed();
		}
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

		const commonUserOptionsPopup = new CommonUserOptionsPopup(
			this.component.page,
		);
		await commonUserOptionsPopup.assertThat().isDisplayed();

		await commonUserOptionsPopup.clickOption(CommonUserPopupOption.PROFILE);

		const userProfileModal = new UserProfileModal(this.component.page);
		await userProfileModal.waitContentToLoad();
		await userProfileModal.assertThat().isDisplayed();
	}

	@step("Ignore user from chat")
	public async ignoreUserFromChat(
		options?: ChatMessageOptions,
	): Promise<void> {
		const messageUserLevel = this.component.map.messageUserAvatar(options);
		await this.component.map.waitForVisibility({
			locator: messageUserLevel,
		});

		await messageUserLevel.click();

		await this.commonUserOptionsPopup.assertThat().isDisplayed();
		await this.commonUserOptionsPopup.clickOption(
			CommonUserPopupOption.IGNORE,
		);
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
}
