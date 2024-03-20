import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { Notifications } from "./notifications";
import { Timeout } from "../../../enums/timeout";

export class NotificationsAsserter extends BaseAsserter<Notifications> {
	public constructor(page: Notifications) {
		super(page);
	}

	public async titleIs(
		title: string,
		options?: { index?: number; title?: string },
	): Promise<void> {
		const titleText = await this.gamdomPage.map
			.notificationTitleLocator(options)
			.textContent();
		expect(titleText).toEqual(title);
	}

	public async subTitleIs(
		subTitle: string,
		options?: { index?: number; title?: string },
	): Promise<void> {
		const subTitleText = await this.gamdomPage.map
			.notificationSubTitleLocator(options)
			.textContent();
		expect(subTitleText).toEqual(subTitle);
	}

	public async isDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		const isVisible = await this.gamdomPage.map
			.notificationContainer(options)
			.isVisible({
				timeout: Timeout.SHORT,
			});
		expect(isVisible).toBe(true);
	}

	public async isNotDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		const isHidden = await this.gamdomPage.map
			.notificationContainer(options)
			.isHidden({
				timeout: Timeout.SHORT,
			});
		expect(isHidden).toBe(true);
	}
}
