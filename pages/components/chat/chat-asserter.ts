import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { Chat } from "./chat";

export class ChatAsserter extends BaseAsserter<Chat> {
	public constructor(chat: Chat) {
		super(chat);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.chatLocator).toBeVisible();
	}
}
