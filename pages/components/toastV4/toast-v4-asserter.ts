import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { ToastStatus } from "@enums/toast-status";
import { logger } from "@logger/logger";
import { expect, Locator } from "@playwright/test";
import { ToastV4 } from "./toast-v4";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";

export class ToastV4Asserter extends BaseAsserter<ToastV4> {
	public constructor(page: ToastV4) {
		super(page);
	}

	@step("Get text from locators - v4")
	private async getTextFromLocatorsV4(locators: Locator): Promise<string[]> {
		return (await locators.allInnerTexts()).map((text) => text.trim());
	}

	private logToastV4StatusV4(
		expectedText: string,
		foundTexts: string[],
		label: string,
		status: ToastStatus,
	): void {
		const baseMessage = `Looking for exact ${label}: "${expectedText}"`;
		const seenMessage = foundTexts
			.map((t, i) => `  [${i}]: "${t}"`)
			.join("\n");
		const message =
			status === ToastStatus.POLL
				? `[TOAST V4 ${status}] ${baseMessage}\nCurrently visible:\n${seenMessage}`
				: `[TOAST V4 ${status}] ${baseMessage}\nLast visible:\n${seenMessage}`;
		logger.info(message);
	}

	@step("Poll toast V4 for expected text - v4")
	private async pollToastV4ForExpectedTextV4({
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
						lastSeenTexts = await this.getTextFromLocatorsV4(
							locators,
						);
						this.logToastV4StatusV4(
							expectedText,
							lastSeenTexts,
							logLabel,
							ToastStatus.POLL,
						);
						return lastSeenTexts.includes(expectedText);
					},
					{ timeout },
				)
				.toBeTruthy();
		} catch {
			this.logToastV4StatusV4(
				expectedText,
				lastSeenTexts,
				logLabel,
				ToastStatus.ASSERT_FAILED,
			);
			throw new Error(
				`Toast V4 with exact ${logLabel} "${expectedText}" not found.`,
			);
		}
	}

	@step("Check toast V4 title - v4")
	public async titleIsV4(
		title: string,
		options?: {
			index?: number;
			subTitle?: string;
			timeout?: number;
		},
	): Promise<void> {
		const toastLocators = this.gamdomPage.map.toastTitleLocatorV4(options);

		await this.pollToastV4ForExpectedTextV4({
			locators: toastLocators,
			expectedText: title,
			timeout: options?.timeout ?? Timeout.MEDIUM,
			logLabel: "title",
		});
	}

	@step("Check toast V4 titles - v4")
	public async titlesAreV4(
		titles: {
			title: string;
			subTitle?: string;
			timeout?: number;
			index?: number;
		}[],
	): Promise<void> {
		for (const toast of titles) {
			const toastLocators =
				this.gamdomPage.map.toastTitleLocatorV4(toast);

			await this.pollToastV4ForExpectedTextV4({
				locators: toastLocators,
				expectedText: toast.title,
				timeout: toast.timeout ?? Timeout.MEDIUM,
				logLabel: "title",
			});
		}
	}

	@step("Check toast V4 subtitle - v4")
	public async subTitleIsV4(
		subTitle: string,
		options: {
			index?: number;
			timeout?: number;
		} = { timeout: Timeout.MEDIUM },
	): Promise<void> {
		const timeout = options.timeout ?? Timeout.MEDIUM;

		if (options.index !== undefined) {
			await expect(
				this.gamdomPage.map.toastSubTitleLocatorV4(options),
			).toHaveText(subTitle, { timeout });
			return;
		}

		const toastLocators = this.gamdomPage.map.toastSubTitleLocatorV4();

		await this.pollToastV4ForExpectedTextV4({
			locators: toastLocators,
			expectedText: subTitle,
			timeout: timeout,
			logLabel: "subtitle",
		});
	}

	@step("Check toast V4 is displayed - v4")
	public async isDisplayedV4(options?: {
		index?: number;
		subTitle?: string;
		timeout?: number;
	}): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.toastContainerV4(options)],
			options?.timeout,
		);
	}

	@step("Check toast V4 is not displayed - v4")
	public async isNotDisplayedV4(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await this.checkElementsAreHidden([
			this.gamdomPage.map.toastContainerV4(options),
		]);
	}

	@step("Toast V4 message is - v4")
	public async toastMessageIsV4(
		title: ToastTitle,
		subtitle: ToastSubTitle,
	): Promise<void> {
		await Promise.all([
			this.isDisplayedV4(),
			this.titleIsV4(title),
			this.subTitleIsV4(subtitle),
		]);
	}
}
