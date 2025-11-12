import { BaseAsserter } from "@base/base-asserter";
import { IntervalMs } from "@enums/interval-millisecond";
import { NotificationButton } from "@enums/notification-buttons";
import { Timeout } from "@enums/timeout";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
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

	@step("Notification message is")
	public async notificationMessageIs(
		title: string,
		subTitle: string,
	): Promise<void> {
		await this.titleIs(title);
		await this.subTitleIs(subTitle);
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

	@step("Wait for notification(s)")
	public async waitForNotification(options?: {
		index?: number;
		expectedCount?: number;
		timeout?: number;
		notificationTitle?: string;
	}): Promise<void> {
		const {
			index,
			expectedCount,
			timeout = Timeout.MAX,
			notificationTitle,
		} = options ?? {};

		if (expectedCount) {
			await this.pollNotificationsForExpectedCount({
				expectedCount,
				timeout,
				notificationTitle,
			});
		} else {
			const container = this.gamdomPage.map.notificationContainer({
				index,
			});
			await expect(container).toBeVisible({ timeout });
		}
	}

	@step("Poll for expected number of notifications")
	private async pollNotificationsForExpectedCount({
		expectedCount,
		timeout,
		notificationTitle,
	}: {
		expectedCount: number;
		timeout: number;
		notificationTitle?: string;
	}): Promise<void> {
		let lastCount = 0;

		try {
			await expect
				.poll(
					async () => {
						const visibleNotificationCount =
							await this.gamdomPage.map
								.toastifyNotificationTitle({
									hasText: notificationTitle,
								})
								.count();

						lastCount = visibleNotificationCount;
						return lastCount > 0 && lastCount <= expectedCount;
					},
					{
						timeout: timeout,
						intervals: [IntervalMs.SHORT],
					},
				)
				.toBeTruthy();
		} catch {
			throw new Error(
				`Number of notifications is out of range (either 0 or greater than ${expectedCount})`,
			);
		}
	}
}
