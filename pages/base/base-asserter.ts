import { waitForPageReadyState, waitUntil } from "@core/utils/utils";
import { DocumentReadyState } from "@enums/playwright/document-ready-states";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";
import { Locator, TestInfo, expect } from "@playwright/test";
import { wwwPattern } from "@support/regex-patterns";
import * as Configuration from "configuration";
import { step } from "decorators/step";
import { BaseComponent } from "./base-component";
import { BaseMap } from "./base-map";
import { BaseModal } from "./base-modal";
import { BasePage } from "./base-page";

export class BaseAsserter<
	T extends BasePage<BaseMap> | BaseModal<BaseMap> | BaseComponent<BaseMap>,
> {
	readonly gamdomPage: T;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
	}

	/**
	 * Verifies that a specified element's visual appearance matches the expected
	 * screenshot. Captures a screenshot of the element and compares it with the
	 * baseline image. Optionally, allows configuration of screenshot options, a custom screenshot name,
	 * and a locator-specific name in the screenshot.
	 *
	 * @param {TestInfo} testInfo - Contains test metadata, including the test title.
	 * @param {Locator} locator - The Playwright Locator object targeting the element to capture.
	 * @param {Object} [options] - Optional parameters for configuring screenshot behavior.
	 * @param {string} [options.screenshotName] - Custom name for the screenshot file. Defaults to `Visual-Tests-<testTitle>.png`.
	 * @param {string} [options.locatorName] - Optional custom name for the locator used in the screenshot file name.
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
	 *   locatorName: 'element-locator',
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
			locatorName?: string;
			toHaveScreenshotOptions?: Parameters<
				ReturnType<typeof expect<Locator>>["toHaveScreenshot"]
			>[0];
		},
	): Promise<void> {
		const testTitle = testInfo.title;
		const locatorName = options?.locatorName
			? `${options.locatorName}-`
			: "";
		const screenshotName =
			options?.screenshotName ??
			`Visual-Tests-${testTitle}${locatorName}.png`;

		await waitForPageReadyState(
			() => this.gamdomPage.page.evaluate(() => document.readyState),
			DocumentReadyState.COMPLETE,
			"Page did not load within the timeout period.",
			Timeout.LONG,
		);

		const defaultOptions = {
			timeout: Timeout.MEDIUM,
			...options?.toHaveScreenshotOptions,
		};

		await expect(locator).toHaveScreenshot(screenshotName, defaultOptions);
	}

	public async verifyVisualDisplay(
		testInfo: TestInfo,
		locator: Locator,
		options: { waitedElement?: Locator; locatorName: string },
	): Promise<void> {
		if (options.waitedElement) {
			await expect(options.waitedElement).toBeVisible();
		}

		await this.checkElementVisualCorrect(testInfo, locator, {
			locatorName: options.locatorName,
		});
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

	public async isElementVisible(
		locators: Locator[],
		timeout: number = Timeout.SHORT,
	): Promise<boolean> {
		try {
			for (const locator of locators) {
				await locator.waitFor({
					state: VisibilityState.VISIBLE,
					timeout: timeout,
				});
			}
			return true;
		} catch {
			return false;
		}
	}

	@step()
	public async verifyCurrentUrlIs(
		expectedUrl: string,
		decodingUrl = false,
	): Promise<void> {
		await this.gamdomPage.page.waitForLoadState();
		let currentUrl = this.gamdomPage.page.url();

		const normalizedExpectedUrl = expectedUrl.startsWith("http")
			? expectedUrl
			: `${Configuration.environment_url}${expectedUrl}`;

		currentUrl = decodingUrl ? decodeURIComponent(currentUrl) : currentUrl;

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

		await waitForPageReadyState(
			() => this.gamdomPage.page.evaluate(() => document.readyState),
			DocumentReadyState.COMPLETE,
			"New tab did not load within the timeout period.",
			Timeout.LONG,
		);

		return newTab.url().toLowerCase();
	}

	/**
	 * Verifies that a given element remains centered by comparing its X position.
	 *
	 * @param element - The Playwright `Locator` representing the element to check.
	 * @param initialXPosition - The expected X coordinate of the element (from the initial state).
	 * @param elementName - A descriptive name for the element (used in error messages).
	 * @throws An error if the element is not visible or if its X position deviates beyond the threshold.
	 */
	public async verifyElementIsCentered(
		element: Locator,
		initialXPosition: number,
		elementName: string,
	): Promise<void> {
		await expect(element).toBeVisible({
			timeout: Timeout.MEDIUM,
		});

		const boundingBox = await element.boundingBox();
		if (!boundingBox) {
			throw new Error(
				`${elementName} container is not available for position check!`,
			);
		}

		expect(boundingBox.x).toBeCloseTo(initialXPosition, 2);
	}
}
