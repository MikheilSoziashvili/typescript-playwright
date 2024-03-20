import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export class NotificationsMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public notificationContainer(options?: {
		index?: number;
		title?: string;
	}): Locator {
		if (options?.index) {
			return this.page
				.getByTestId("notificationContainer")
				.nth(options?.index - 1);
		} else if (options?.title) {
			return this.page
				.locator(
					`*[data-testid=notificationContainer]:has(*[data-testid=notificationTitle]:text-is("${options.title}"))`,
				)
				.first();
		} else {
			return this.page.getByTestId("notificationContainer").first();
		}
	}

	public notificationTitleLocator(options?: {
		index?: number;
		title?: string;
	}): Locator {
		return this.notificationContainer(options).getByTestId(
			"notificationTitle",
		);
	}

	public notificationSubTitleLocator(options?: {
		index?: number;
		title?: string;
	}): Locator {
		return this.notificationContainer(options).getByTestId(
			"notificationSubTitle",
		);
	}

	public notificationGotItButtonLocator(options?: {
		index?: number;
		title?: string;
	}): Locator {
		return this.notificationContainer(options).getByTestId(
			"notificationGotItButton",
		);
	}
}
