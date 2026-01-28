import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class NotificationsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get notificationToggleButton(): Locator {
		return this.page.getByTestId("notification-id");
	}

	private get notificationContentWrapper(): Locator {
		return this.page.getByTestId("footer-info-accordion-v4-content");
	}

	private get notificationTitleElements(): Locator {
		return this.page.locator('p[data-testid^="notification-title-"]');
	}

	private get notificationDescriptionElements(): Locator {
		return this.page.locator('p[data-testid^="notification-content-"]');
	}

	public getNotificationContainer(title: string): Locator {
		const notificationTitleAnchor = this.notificationTitleElements.getByText(
			title,
			{ exact: true },
		);
		const titleAncestorDivs = notificationTitleAnchor.locator("xpath=ancestor::div");

		return titleAncestorDivs
			.filter({ has: this.notificationToggleButton })
			.filter({ has: this.notificationContentWrapper })
			.first();
	}

	public getNotificationTitle(title: string): Locator {
		return this.getNotificationContainer(title).locator(
			this.notificationTitleElements,
		);
	}

	public expandNotificationButton(title: string): Locator {
		return this.getNotificationContainer(title).locator(
			this.notificationToggleButton,
		);
	}

	public getNotificationDescription(title: string): Locator {
		return this.getNotificationContainer(title).locator(
			this.notificationDescriptionElements,
		);
	}
}
