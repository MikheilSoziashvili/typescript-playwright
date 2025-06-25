import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { Notification } from "./notification";

export class NotificationAsserter extends BaseAsserter<Notification> {
	public constructor(page: Notification) {
		super(page);
	}

	@step("Check notification title")
	public async titleIs(
		title: string,
		options?: { index?: number },
	): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationTitleLocator(options),
		).toHaveText(title);
	}

	@step("Check notification subtitle")
	public async subTitleIs(
		subTitle: string,
		options?: { index?: number; title?: string },
	): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationSubTitleLocator(options),
		).toHaveText(subTitle);
	}

	@step("Check notification is displayed")
	public async isDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationContainer(options),
		).toBeVisible();
	}

	@step("Check notification is not displayed")
	public async isNotDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationContainer(options),
		).toBeHidden();
	}
}
