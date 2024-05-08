import { Locator, Page } from "@playwright/test";
import { BaseMap } from "base/base-map";

export class ToastMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public toastContainer(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		if (options?.index) {
			return this.page
				.getByTestId("toastContainer")
				.nth(options.index - 1);
		} else if (options?.subTitle) {
			return this.page
				.locator(
					`*[data-testid=toastContainer]:has(*[data-testid=toastSubTitle]:text-is("${options.subTitle}"))`,
				)
				.first();
		} else {
			return this.page.getByTestId("toastContainer").first();
		}
	}

	public toastTitleLocator(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainer(options).getByTestId("toastTitle");
	}

	public toastSubTitleLocator(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastContainer(options).getByTestId("toastSubTitle");
	}

	public toastHereButtonLocator(options?: {
		index?: number;
		subTitle?: string;
	}): Locator {
		return this.toastSubTitleLocator(options).locator(
			"span:text-is('here')",
		);
	}
}
