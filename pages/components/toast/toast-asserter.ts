import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
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
			timeout?: number;
		},
	): Promise<void> {
		await expect(this.gamdomPage.map.toastTitleLocator(options)).toHaveText(
			title,
			{ timeout: options?.timeout },
		);
	}

	public async subTitleIs(
		subTitle: string,
		options?: {
			index?: number;
			timeout?: number;
		},
	): Promise<void> {
		if (options?.index) {
			await expect(
				this.gamdomPage.map.toastSubTitleLocator(options),
			).toHaveText(subTitle, { timeout: options.timeout });
		} else {
			const toastLocators =
				this.gamdomPage.map.toastSubTitleLocator(options);
			const filteredToastLocators = toastLocators.filter({
				hasText: subTitle,
			});
			await expect(filteredToastLocators).toHaveCount(1, {
				timeout: options?.timeout,
			});
		}
	}

	public async isDisplayed(options?: {
		index?: number;
		subTitle?: string;
		timeout?: number;
	}): Promise<void> {
		await expect(this.gamdomPage.map.toastContainer(options)).toBeVisible({
			timeout: options?.timeout,
		});
	}

	public async isNotDisplayed(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await expect(this.gamdomPage.map.toastContainer(options)).toBeHidden();
	}
}
