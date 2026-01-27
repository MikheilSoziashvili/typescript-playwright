import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ToastMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get toastContainers(): Locator {
		return this.page.getByTestId("toast-message-container");
	}

	public toastContainer(options?: {
		index?: number;
		subTitle?: string;
		title?: string;
	}): Locator {
		if (options?.index) {
			return this.toastContainers.nth(options.index - 1);
		}
		let result = this.toastContainers;

		const filters = [
			{
				condition: options?.subTitle,
				testId: "toast-message-message",
			},
			{
				condition: options?.title,
				testId: "toast-message-status-title",
			},
		];

		for (const { condition, testId } of filters) {
			if (condition) {
				result = result.filter({
					has: this.page
						.getByTestId(testId)
						.getByText(condition, { exact: true }),
				});
			}
		}

		return result.first();
	}

	public toastTitleLocator(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainer(options).getByTestId(
			"toast-message-status-title",
		);
	}

	public toastSubTitleLocator(options?: { index?: number }): Locator {
		return this.toastContainer(options).getByTestId(
			"toast-message-message",
		);
	}

	public toastIconLocator(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainer(options).getByTestId("toast-message-icon");
	}

	public toastCloseButtonLocator(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainer(options).getByTestId(
			"close-btn-undefined-close-btn",
		);
	}
}
