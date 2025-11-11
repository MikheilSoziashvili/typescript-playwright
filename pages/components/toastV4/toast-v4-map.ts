import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ToastV4Map extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public toastContainerV4(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		if (options?.index) {
			return this.page
				.getByTestId("toast-message-container")
				.nth(options.index - 1);
		} else if (options?.subTitle) {
			return this.page
				.getByTestId("toast-message-container")
				.filter({
					has: this.page
						.getByTestId("toast-message-message")
						.getByText(options.subTitle, { exact: true }),
				})
				.first();
		} else {
			return this.page.getByTestId("toast-message-container").first();
		}
	}

	public toastTitleLocatorV4(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainerV4(options).getByTestId(
			"toast-message-status-title",
		);
	}

	public toastSubTitleLocatorV4(options?: { index?: number }): Locator {
		return this.toastContainerV4(options).getByTestId(
			"toast-message-message",
		);
	}

	public toastIconLocatorV4(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainerV4(options).getByTestId("toast-message-icon");
	}

	public toastCloseButtonLocatorV4(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainerV4(options).getByTestId(
			"close-btn-undefined-close-btn",
		);
	}
}
