import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { ChatMap } from "./chat-map";
import { ChatAsserter } from "./chat-asserter";
import { ChatSteps } from "./chat-steps";
import { VisibilityState } from "../../../enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";

export class Chat extends BaseComponent<ChatMap> {
	constructor(page: Page) {
		super(page, new ChatMap(page));
	}

	public assertThat(): ChatAsserter {
		return new ChatAsserter(this);
	}

	public steps(): ChatSteps {
		return new ChatSteps(this);
	}

	@step("Wait chat to be displayed")
	public async waitChatToBeDisplayed(): Promise<void> {
		await this.map.waitFor({
			locator: this.map.chatLocator,
			state: VisibilityState.ATTACHED,
			timeout: Timeout.MEDIUM,
		});
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
}
