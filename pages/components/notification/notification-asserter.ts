import { BaseAsserter } from "@base/base-asserter";
import { NotificationButton } from "@enums/notification-buttons";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { Notification } from "./notification";
import { Timeout } from "@enums/timeout";

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

	@step("Check notification got it button is displayed")
	public async gotItButtonIsDisplayed(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationGotItButtonLocator(options),
		).toBeVisible();
	}

	@step("Check notification button text")
	public async buttonTextIs(
		buttonText: NotificationButton,
		options?: { index?: number; title?: string },
	): Promise<void> {
		await expect(
			this.gamdomPage.map.notificationGotItButtonLocator(options),
		).toHaveText(buttonText);
	}

	@step("Open button is fully visible and inside the notification popup")
	public async openButtonIsFullyVisibleAndInside(options?: {
		index?: number;
		title?: string;
	}): Promise<void> {
		const popup = this.gamdomPage.map.notificationContainer(options);
		const button =
			this.gamdomPage.map.notificationGotItButtonLocator(options);

		await expect(button).toBeVisible();

		await this.expectLocatorInside(button, popup);
		await this.expectElementWithinViewport(button);
	}

	@step("Notification popup is correct for long message")
	public async looksCorrectForLongMessage(
		message: string,
		options?: { index?: number; title?: string },
	): Promise<void> {
		await this.isDisplayed(options);
		await this.gotItButtonIsDisplayed(options);
		await this.buttonTextIs(NotificationButton.OPEN, options);

		await expect(
			this.gamdomPage.map.notificationTitleLocator(options),
		).toContainText(message);

		await this.openButtonIsFullyVisibleAndInside(options);
	}

	@step("Wait for notification")
	public async waitForNotification(options?: {
		index?: number;
		timeout?: number;
	}): Promise<void> {
		const { index, timeout = Timeout.SHORT } = options ?? {};
		const container = this.gamdomPage.map.notificationContainer({ index });

		await expect(container).toBeVisible({ timeout });
	}
}
