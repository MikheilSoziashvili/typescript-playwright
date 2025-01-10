import { waitUntil } from "@core/utils/utils";
import { DocumentReadyState } from "@enums/playwright/document-ready-states";
import { Timeout } from "@enums/timeout";
import { WaitUntilState } from "@enums/wait-until-states";
import { Locator, TestInfo, expect } from "@playwright/test";
import { wwwPattern } from "@support/regex-patterns";
import * as Configuration from "configuration";
import { step } from "decorators/step";
import { BaseComponent } from "./base-component";
import { BaseModal } from "./base-modal";
import { BasePage } from "./base-page";
export class BaseAsserter<T extends BasePage | BaseModal | BaseComponent> {
	readonly gamdomPage: T;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
	}

	/**
	 * Verifies that a specified element's visual appearance matches the expected
	 * screenshot. Captures a screenshot of the element and compares it with the
	 * baseline image. Optionally, allows configuration of screenshot options and
	 * a custom screenshot name.
	 *
	 * @param {TestInfo} testInfo - Contains test metadata, including the test title.
	 * @param {Locator} locator - The Playwright Locator object targeting the element to capture.
	 * @param {Object} [options] - Optional parameters for configuring screenshot behavior.
	 * @param {string} [options.screenshotName] - Custom name for the screenshot file. Defaults to `Visual-Tests-<testTitle>.png`.
	 * @param {Object} [options.toHaveScreenshotOptions] - Options for the `.toHaveScreenshot` assertion, such as timeout and thresholds.
	 * @returns {Promise<void>} - Resolves when the screenshot comparison is complete.
	 *
	 * @remarks
	 * Waits for the network to be idle to ensure all asynchronous operations are
	 * complete, reducing the chance of false negatives in visual testing.
	 *
	 * @example
	 * ```typescript
	 * await checkElementVisualCorrect(testInfo, page.locator('#element'), {
	 *   screenshotName: 'CustomScreenshot.png',
	 *   toHaveScreenshotOptions: { threshold: 0.1 }
	 * });
	 * ```
	 */
	@step("Element's screenshot matches expected appearance")
	public async checkElementVisualCorrect(
		testInfo: TestInfo,
		locator: Locator,
		options?: {
			screenshotName?: string;
			toHaveScreenshotOptions?: Parameters<
				ReturnType<typeof expect<Locator>>["toHaveScreenshot"]
			>[0];
		},
	): Promise<void> {
		const testTitle = testInfo.title;
		const screenshotName =
			options?.screenshotName ?? `Visual-Tests-${testTitle}.png`;

		// eslint-disable-next-line playwright/no-networkidle
		await this.gamdomPage.page.waitForLoadState(
			WaitUntilState.NETWORK_IDLE,
		);

		const defaultOptions = {
			timeout: Timeout.MEDIUM,
			...options?.toHaveScreenshotOptions,
		};

		await expect(locator).toHaveScreenshot(screenshotName, defaultOptions);
	}

	public async checkElementsAreVisible(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect(element).toBeVisible({ timeout });
		}
	}

	public async checkElementsAreNotVisible(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect(element).not.toBeVisible({ timeout });
		}
	}

	public async checkStringElementsAreEqual(
		expectedTexts: string[],
		actualTexts: string[],
	): Promise<void> {
		expect(expectedTexts.length).toBe(actualTexts.length);
		expectedTexts.forEach((expectedText, index) => {
			expect(expectedText.trim()).toBe(actualTexts[index].trim());
		});
	}

	@step()
	public async verifyCurrentUrlIs(expectedUrl: string): Promise<void> {
		await this.gamdomPage.page.waitForLoadState();
		const currentUrl = this.gamdomPage.page.url();

		const normalizedExpectedUrl = expectedUrl.startsWith("http")
			? expectedUrl
			: `${Configuration.environment_url}${expectedUrl}`;

		expect(currentUrl).toBe(normalizedExpectedUrl);
	}

	@step("Verify parts of the new tab URL")
	public async verifyNewTabUrlParts(urlParts: string[]): Promise<void> {
		const newTabUrl = await this.getNewTabUrl();

		urlParts.forEach((part) => {
			expect(newTabUrl).toContain(part.toLowerCase());
		});
	}

	@step("Verify new tab URL is correct")
	public async verifyNewTabUrl(expectedUrl: string): Promise<void> {
		let newTabUrl = await this.getNewTabUrl();

		if (wwwPattern.test(newTabUrl)) {
			newTabUrl = newTabUrl.replace(wwwPattern, "");
		}

		expect(newTabUrl).toBe(expectedUrl.toLowerCase());
	}

	private async getNewTabUrl(): Promise<string> {
		await waitUntil(
			() => this.gamdomPage.page.context().pages().length > 1,
			{ errorMessage: "Pages count is not expected" },
		);

		const pages = this.gamdomPage.page.context().pages();
		const newTab = pages[pages.length - 1];

		await waitUntil(
			async () => {
				try {
					const readyState = await newTab.evaluate(
						() => document.readyState,
					);
					return readyState === DocumentReadyState.COMPLETE;
				} catch (error) {
					if (
						error instanceof Error &&
						error.message.includes("destroyed")
					) {
						return false;
					}
					throw error;
				}
			},
			{
				errorMessage: "New tab did not load within the timeout period.",
				intervalSeconds: 0.1,
				timeoutSeconds: Timeout.LONG,
			},
		);

		return newTab.url().toLowerCase();
	}
}
