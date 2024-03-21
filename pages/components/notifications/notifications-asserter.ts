import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { Notifications } from "./notifications";

export class NotificationsAsserter extends BaseAsserter<Notifications> {
	public constructor(page: Notifications) {
		super(page);
	}

	public async titleIs(
		title: string,
		options?: { index?: number },
	): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationTitleLocator(options),
		).toHaveText(title);
	}

	public async subTitleIs(
		subTitle: string,
		options?: { index?: number; title?: string },
	): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationSubTitleLocator(options),
		).toHaveText(subTitle);
	}

	public async isDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationContainer(options),
		).toBeVisible();
	}

	public async isNotDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationContainer(options),
		).toBeHidden();
	}
}
