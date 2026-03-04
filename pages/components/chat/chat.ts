import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BaseComponent } from "../../base/base-component";
import { ChatAsserter } from "./chat-asserter";
import { ChatMap, ChatMessageOptions } from "./chat-map";
import { ChatSteps } from "./chat-steps";
import { Toast } from "../toast/toast";

export class Chat extends BaseComponent<ChatMap> {
	public toast: Toast;
	constructor(page: Page) {
		super(page, new ChatMap(page));
		this.toast = new Toast(page);
	}

	public assertThat(): ChatAsserter {
		return new ChatAsserter(this);
	}

	public steps(): ChatSteps {
		return new ChatSteps(this);
	}

	@step("Wait chat to be displayed")
	public async waitChatToBeDisplayed(): Promise<void> {
		await this.assertThat().chatIsDisplayed();
		await this.assertThat().checkElementsAreVisible([
			this.map.chatHeader,
			this.map.chatMessagesList,
		]);
	}

	@step("Claim rain")
	public async claimRain(): Promise<void> {
		await this.map.claimRainButton.click();
	}

	@step("Get rain user count")
	public async getRainUserCount(): Promise<number> {
		const userCountText =
			await this.map.lastRainbotMessageUserCount.innerText();
		return parseInt(userCountText.trim(), 10);
	}

	@step("Select chatroom")
	public async selectChatroom(chatroomName: string): Promise<void> {
		await this.map.chatroomsDropdownSelectedValue.click();
		await this.map.chatroomDropdownOption(chatroomName).click();
	}

	@step("Close a specific pinned message")
	public async closePinnedMessage(
		options?: ChatMessageOptions,
	): Promise<void> {
		await this.map.pinnedMessageCloseButton(options).click();
	}

	@step("Close all pinned messages")
	public async closeAllPinnedMessages(): Promise<void> {
		while ((await this.map.allPinnedCloseButtons.count()) > 0) {
			await this.map.allPinnedCloseButtons.first().click();
		}
	}

	@step("Expand chat - v4")
	public async expandChatV4(): Promise<void> {
		await this.map.chatButtonV4.click();
	}
}
