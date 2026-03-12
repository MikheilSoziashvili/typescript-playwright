import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class NotificationsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get notificationToggleButton(): Locator {
		return this.page.getByTestId("notification-id");
	}

private get notificationTitleElements(): Locator {
		return this.page.locator('p[data-testid^="notification-title-"]');
	}


	public getNotificationContainer(title: string): Locator {
		return this.page
			.locator("div[class*='StyledCollapsibleHeader']")
			.filter({
				has: this.notificationTitleElements.getByText(title, {
					exact: true,
				}),
			})
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
		return this.getNotificationContainer(title)
			.locator("xpath=following-sibling::div")
			.first()
			.locator('p[data-testid^="notification-content-"]');
	}
}
