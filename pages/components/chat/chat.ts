import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { ChatMap } from "./chat-map";
import { ChatAsserter } from "./chat-asserter";
import { ChatSteps } from "./chat-steps";

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
		await this.map.chatLocator.waitFor({ state: "attached" });
		await this.map.chatLocator.waitFor({ state: "visible" });
	}
}
