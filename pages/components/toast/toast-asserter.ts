import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { Toast } from "./toast";
import { logger } from "@logger/logger";
import { Timeout } from "@enums/timeout";

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

	public async titlesAre(
		titles: {
			title: string;
			subTitle?: string;
			timeout?: number;
			index?: number;
		}[],
	): Promise<void> {
		for (const toast of titles) {
			await expect(
				this.gamdomPage.map.toastTitleLocator(toast),
			).toHaveText(toast.title, { timeout: toast.timeout });
		}
	}

	public async subTitleIs(
		subTitle: string,
		options: {
			index?: number;
			timeout?: number;
		} = { timeout: Timeout.LONG },
	): Promise<void> {
		const timeout = options.timeout;

		if (options.index !== undefined) {
			await expect(
				this.gamdomPage.map.toastSubTitleLocator(options),
			).toHaveText(subTitle, { timeout });
			return;
		}

		const toastLocators = this.gamdomPage.map.toastSubTitleLocator();
		let lastSeenTexts: string[] = [];

		try {
			await expect
				.poll(
					async () => {
						const count = await toastLocators.count();
						lastSeenTexts = [];

						for (let i = 0; i < count; i++) {
							const text = (
								await toastLocators.nth(i).innerText()
							).trim();
							lastSeenTexts.push(text);
						}

						logger.info(
							`[TOAST POLL] Looking for: "${subTitle}"\nCurrently found:\n${lastSeenTexts
								.map((t, i) => `  [${i}]: "${t}"`)
								.join("\n")}`,
						);

						return lastSeenTexts.includes(subTitle);
					},
					{ timeout },
				)
				.toBeTruthy();
		} catch (e) {
			logger.info(
				`[TOAST ASSERT FAILED] Expected subtitle: "${subTitle}"\nLast seen toasts:\n${lastSeenTexts
					.map((t, i) => `  [${i}]: "${t}"`)
					.join("\n")}`,
			);
			throw new Error(
				`Toast with exact subtitle "${subTitle}" not found.`,
			);
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
