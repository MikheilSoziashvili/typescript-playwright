import { BaseComponentStep } from "../../../core/helpers/base-component-step";
import { CommonUserPopupOptions } from "../../../enums/common-user-popup-options";
import { TipUserModal } from "../../modals/tip-user-modal/tip-user-modal";
import { UserProfileModal } from "../../modals/user-profile-modal/user-profile-modal";
import { CommonUserOptionsPopup } from "../popups/common-user-options-popup";
import { Chat } from "./chat";
import { ChatMessageOptions } from "./chat-map";

export class ChatSteps extends BaseComponentStep<Chat> {
	public constructor(component: Chat) {
		super(component);
	}

	public async openTipUserModal(options?: ChatMessageOptions): Promise<void> {
		const messageUserLevel = this.component.map.messageUserLevel(options);
		await messageUserLevel.waitFor({ state: "visible" });

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
		await messageUserLevel.waitFor({ state: "visible" });

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
