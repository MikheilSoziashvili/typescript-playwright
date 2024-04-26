import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { Toast } from "./toast";

export class ToastAsserter extends BaseAsserter<Toast> {
	public constructor(page: Toast) {
		super(page);
	}

	public async titleIs(
		title: string,
		options?: {
			index?: number;
			subTitle?: string;
		},
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.toastTitleLocator(options))
			.toHaveText(title);
	}

	public async subTitleIs(
		subTitle: string,
		options?: {
			index?: number;
			subTitle?: string;
		},
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.toastSubTitleLocator(options))
			.toHaveText(subTitle);
	}

	public async isDisplayed(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.toastContainer(options))
			.toBeVisible();
	}

	public async isNotDisplayed(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.toastContainer(options))
			.toBeHidden();
	}
}
