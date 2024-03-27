import { BaseComponentStep } from "../../../core/helpers/base-component-step";
import { hardWait } from "../../../core/utils";
import { CommonUserPopupOptions } from "../../../enums/common-user-popup-options";
import { TipUserModal } from "../../modals/tip-user-modal/tip-user-modal";
import { CommonUserOptionsPopup } from "../popups/common-user-options-popup";
import { Chat } from "./chat";
import { ChatMessageOptions } from "./chat-map";

export class ChatSteps extends BaseComponentStep<Chat> {
	public constructor(component: Chat) {
		super(component);
	}

	public async openTipUserModal(options?: ChatMessageOptions): Promise<void> {
		const message = this.component.map.messageLocator(options);
		await message.waitFor({ state: "visible" });
		await hardWait(5 * 1000);

		await message
			.locator("img")
			// eslint-disable-next-line playwright/no-force-option
			.click({ force: true, position: { x: 23, y: 32 }, timeout: 3000 });
		console.log("maoooo clicked");

		const commonUserOptionsPopup = new CommonUserOptionsPopup(
			this.component.page,
		);
		await hardWait(10 * 1000);
		await commonUserOptionsPopup.assertThat().isDisplayed();

		await commonUserOptionsPopup.clickOption(
			CommonUserPopupOptions.TIP_USER,
		);

		const tipUserModal = new TipUserModal(this.component.page);
		await tipUserModal.assertThat().isDisplayed();
	}
}
