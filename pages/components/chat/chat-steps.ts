import { BaseComponentStep } from "@pages/base/base-component-step";
import { CommonUserPopupOptions } from "@enums/common-user-popup-options";
import { VisibilityStates } from "@enums/playwright/visibility-states";
import { TipUserModal } from "@modals/tip-user-modal/tip-user-modal";
import { UserProfileModal } from "@modals/user-profile-modal/user-profile-modal";
import { AuthenticatedHeader } from "../header/authenticated/authenticated-header";
import { CommonUserOptionsPopup } from "../popups/common-user-options-popup";
import { Chat } from "./chat";
import { ChatMessageOptions } from "./chat-map";

export class ChatSteps extends BaseComponentStep<Chat> {
	private authenticatedHeader: AuthenticatedHeader;

	public constructor(component: Chat) {
		super(component);
		this.authenticatedHeader = this.createAuthenticatedHeader();
	}

	private createAuthenticatedHeader(): AuthenticatedHeader {
		return new AuthenticatedHeader(this.component.page);
	}

	public async sendMessage(message: string): Promise<void> {
		await this.authenticatedHeader.expandChatIfNotVisible();
		await this.component.map.chatTextBox.fill(message);
		await this.component.map.sendMessageButton.click();
	}

	public async openTipUserModal(options?: ChatMessageOptions): Promise<void> {
		const messageUserLevel = this.component.map.messageUserLevel(options);
		await this.component.map.waitFor({
			locator: messageUserLevel,
			state: VisibilityStates.VISIBLE,
		});

		await messageUserLevel.click();

		const commonUserOptionsPopup = new CommonUserOptionsPopup(
			this.component.page,
		);
		await commonUserOptionsPopup.assertThat().isDisplayed();

		await commonUserOptionsPopup.clickOption(
			CommonUserPopupOptions.TIP_USER,
		);

		const tipUserModal = new TipUserModal(this.component.page);
		await tipUserModal.assertThat().isDisplayed();
	}

	public async openUserProfileModal(
		options?: ChatMessageOptions,
	): Promise<void> {
		const messageUserLevel = this.component.map.messageUserLevel(options);
		await this.component.map.waitFor({
			locator: messageUserLevel,
			state: VisibilityStates.VISIBLE,
		});

		await messageUserLevel.click();

		const commonUserOptionsPopup = new CommonUserOptionsPopup(
			this.component.page,
		);
		await commonUserOptionsPopup.assertThat().isDisplayed();

		await commonUserOptionsPopup.clickOption(
			CommonUserPopupOptions.PROFILE,
		);

		const userProfileModal = new UserProfileModal(this.component.page);
		await userProfileModal.waitContentToLoad();
		await userProfileModal.assertThat().isDisplayed();
	}
}
