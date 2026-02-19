import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class NotificationMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public notificationContainer(options?: {
		index?: number;
		title?: string;
	}): Locator {
		if (options?.index) {
			return this.page
				.getByTestId("notification-message-container")
				.nth(options.index - 1);
		} else if (options?.title) {
			return this.page
				.locator(
					`*[data-testid=notification-message-container]:has(*[data-testid=notification-message-title]:text-is("${options.title}"))`,
				)
				.first();
		} else {
			return this.page
				.getByTestId("notification-message-container")
				.first();
		}
	}

	public notificationTitleLocator(options?: {
		index?: number;
		title?: string;
	}): Locator {
		return this.notificationContainer(options).getByTestId(
			"notification-message-title",
		);
	}

	public notificationSubTitleLocator(options?: {
		index?: number;
		title?: string;
	}): Locator {
		return this.notificationContainer(options).getByTestId(
			"notification-message-subtitle",
		);
	}

	public notificationGotItButtonLocator(options?: {
		index?: number;
		title?: string;
	}): Locator {
		return this.notificationContainer(options).getByTestId(
			"notification-message-acknowledge-btn",
		);
	}

	public toastifyNotificationsContainer(): Locator {
		return this.page.locator(
			"div.Toastify__toast.notification-message-body-desktop",
		);
	}

	public toastifyNotification(): Locator {
		return this.page.getByTestId("notificationContainer");
	}

	public toastifyNotificationTitle(options?: { hasText?: string }): Locator {
		const { hasText } = options ?? {};
		const locator =
			this.toastifyNotificationsContainer().getByTestId(
				"notificationTitle",
			);
		return hasText ? locator.filter({ hasText }) : locator;
	}
}
