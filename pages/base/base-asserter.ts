import { Locator, TestInfo, expect } from "@playwright/test";
import { BaseComponent } from "./base-component";
import { BaseModal } from "./base-modal";
import { BasePage } from "./base-page";
import { waitUntil } from "@core/utils/utils";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
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
		await this.gamdomPage.page.waitForLoadState("networkidle");

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
		expect(currentUrl).toBe(expectedUrl);
	}

	@step("New tab url is correct")
	public async verifyNewTabUrl(urlParts: string[]): Promise<void> {
		await waitUntil(
			() => this.gamdomPage.page.context().pages().length > 1,
			{ errorMessage: "Pages count is not expected" },
		);

		const pages = this.gamdomPage.page.context().pages();
		const newTab = pages[pages.length - 1];
		await newTab.waitForLoadState("domcontentloaded");

		const newTabUrl = newTab.url();
		urlParts.forEach((part) => {
			expect(newTabUrl).toContain(part);
		});
	}
}
