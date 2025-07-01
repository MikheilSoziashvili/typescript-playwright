import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { expect, Locator } from "@playwright/test";
import { Toast } from "./toast";

export class ToastAsserter extends BaseAsserter<Toast> {
	public constructor(page: Toast) {
		super(page);
	}

	@step("Get text from locators")
	private async getTextFromLocators(locators: Locator): Promise<string[]> {
		const count = await locators.count();
		const texts: string[] = [];
		for (let i = 0; i < count; i++) {
			const text = (await locators.nth(i).innerText()).trim();
			texts.push(text);
		}
		return texts;
	}

	private logToastStatus(
		expectedText: string,
		foundTexts: string[],
		label: string,
		status: "POLL" | "ASSERT FAILED",
	): void {
		const baseMessage = `Looking for exact ${label}: "${expectedText}"`;
		const seenMessage = foundTexts
			.map((t, i) => `  [${i}]: "${t}"`)
			.join("\n");
		const message =
			status === "POLL"
				? `[TOAST ${status}] ${baseMessage}\nCurrently visible:\n${seenMessage}`
				: `[TOAST ${status}] ${baseMessage}\nLast visible:\n${seenMessage}`;
		logger.info(message);
	}

	@step("Poll toast for expected text")
	private async pollToastForExpectedText({
		locators,
		expectedText,
		timeout,
		logLabel,
	}: {
		locators: Locator;
		expectedText: string;
		timeout: number;
		logLabel: string;
	}): Promise<void> {
		let lastSeenTexts: string[] = [];
		try {
			await expect
				.poll(
					async () => {
						lastSeenTexts = await this.getTextFromLocators(
							locators,
						);
						this.logToastStatus(
							expectedText,
							lastSeenTexts,
							logLabel,
							"POLL",
						);
						return lastSeenTexts.includes(expectedText);
					},
					{ timeout },
				)
				.toBeTruthy();
		} catch (e) {
			this.logToastStatus(
				expectedText,
				lastSeenTexts,
				logLabel,
				"ASSERT FAILED",
			);
			throw new Error(
				`Toast with exact ${logLabel} "${expectedText}" not found.`,
			);
		}
	}

	@step("Check toast title")
	public async titleIs(
		title: string,
		options?: {
			index?: number;
			subTitle?: string;
			timeout?: number;
		},
	): Promise<void> {
		const toastLocators = this.gamdomPage.map.toastTitleLocator(options);

		await this.pollToastForExpectedText({
			locators: toastLocators,
			expectedText: title,
			timeout: options?.timeout ?? Timeout.LONG,
			logLabel: "title",
		});
	}

	@step("Check toast titles")
	public async titlesAre(
		titles: {
			title: string;
			subTitle?: string;
			timeout?: number;
			index?: number;
		}[],
	): Promise<void> {
		for (const toast of titles) {
			const toastLocators = this.gamdomPage.map.toastTitleLocator(toast);

			await this.pollToastForExpectedText({
				locators: toastLocators,
				expectedText: toast.title,
				timeout: toast.timeout ?? Timeout.LONG,
				logLabel: "title",
			});
		}
	}

	@step("Check toast subtitle")
	public async subTitleIs(
		subTitle: string,
		options: {
			index?: number;
			timeout?: number;
		} = { timeout: Timeout.LONG },
	): Promise<void> {
		const timeout = options.timeout ?? Timeout.LONG;

		if (options.index !== undefined) {
			await expect(
				this.gamdomPage.map.toastSubTitleLocator(options),
			).toHaveText(subTitle, { timeout });
			return;
		}

		const toastLocators = this.gamdomPage.map.toastSubTitleLocator();

		await this.pollToastForExpectedText({
			locators: toastLocators,
			expectedText: subTitle,
			timeout: timeout,
			logLabel: "subtitle",
		});
	}

	@step("Check toast is displayed")
	public async isDisplayed(options?: {
		index?: number;
		subTitle?: string;
		timeout?: number;
	}): Promise<void> {
		await expect(this.gamdomPage.map.toastContainer(options)).toBeVisible({
			timeout: options?.timeout,
		});
	}

	@step("Check toast is not displayed")
	public async isNotDisplayed(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await expect(this.gamdomPage.map.toastContainer(options)).toBeHidden();
	}
}
