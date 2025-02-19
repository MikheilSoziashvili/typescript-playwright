import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { ChatMap } from "./chat-map";
import { ChatAsserter } from "./chat-asserter";
import { ChatSteps } from "./chat-steps";
import { VisibilityState } from "../../../enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";

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

	public async waitChatToBeDisplayed(): Promise<void> {
		await this.map.waitFor({
			locator: this.map.chatLocator,
			state: VisibilityState.ATTACHED,
			timeout: Timeout.MEDIUM,
		});
		await this.map.waitForVisibility({
			locator: this.map.chatLocator,
		});
	}

	public async claimRain(): Promise<void> {
		await this.map.claimRainButton.click();
	}

	public async getRainUserCount(): Promise<number> {
		const userCountText =
			await this.map.lastRainbotMessageUserCount.innerText();
		return parseInt(userCountText.trim(), 10);
	}
}
