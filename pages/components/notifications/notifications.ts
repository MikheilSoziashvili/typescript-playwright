import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { NotificationsMap } from "./notifications-map";
import { NotificationsAsserter } from "./notifications-asserter";

export class Notifications extends BaseComponent<NotificationsMap> {
	constructor(page: Page) {
		super(page, new NotificationsMap(page));
	}

	public assertThat(): NotificationsAsserter {
		return new NotificationsAsserter(this);
	}

	public async aknowledge(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		await this.map
			.notificationContainer(options)
			.waitFor({ state: "visible" });
		await this.map.notificationGotItButtonLocator(options).click();
		await this.map
			.notificationContainer(options)
			.waitFor({ state: "hidden" });
	}
}
