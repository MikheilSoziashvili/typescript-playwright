import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { NotificationMap } from "./notification-map";
import { NotificationAsserter } from "./notification-asserter";

export class Notification extends BaseComponent<NotificationMap> {
	constructor(page: Page) {
		super(page, new NotificationMap(page));
	}

	public assertThat(): NotificationAsserter {
		return new NotificationAsserter(this);
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
