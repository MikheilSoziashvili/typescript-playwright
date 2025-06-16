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
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { OgProperties } from "@enums/playwright/htmlOgProperties";
import { OgPropertiesValues } from "@enums/playwright/htmlOgPropertiesValues";
import { logger } from "@logger/logger";

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

	protected async assertOnElements(
		elements: Locator[],
		assertion: (el: Locator) => Promise<void>,
	): Promise<void> {
		await Promise.all(elements.map((el) => assertion(el)));
	}

	protected async assertOnValues<T>(
		values: T[],
		assertion: (value: T) => Promise<void>,
	): Promise<void> {
		await Promise.all(values.map((value) => assertion(value)));
	}

	public async checkElementsAreDefined(
		valuesToCheck: { value: unknown; message: string }[],
	): Promise<void> {
		await this.assertOnValues(valuesToCheck, async ({ value, message }) => {
			expect(value, message).toBeDefined();
		});
	}

	public async checkElementsAreHidden(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		await this.assertOnElements(elements, (el) =>
			expect(el).toBeHidden({ timeout }),
		);
	}

	public async checkElementsAreEnabled(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect(element).toBeEnabled({ timeout });
		}
	}

	public async checkElementsAreDisabled(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect(element).toBeDisabled({ timeout });
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

	public async verifySliderState(
		slider: Locator,
		expected: BooleanValueString,
		timeout?: number,
	): Promise<void> {
		await expect(slider).toHaveAttribute(
			Attributes.ARIA_DISABLED,
			expected,
			{ timeout },
		);
	}

	/**
	 * Normalizes a URL by adding the environment URL prefix if it's a relative path
	 * @param url The URL to normalize
	 * @returns The normalized URL with full domain
	 * @private
	 */
	private normalizeUrl(url: string): string {
		return url.startsWith("http")
			? url
			: `${Configuration.environment_url}${url}`;
	}

	@step("Wait for and verify current URL is as expected")
	public async waitForAndVerifyCurrentUrlIs(
		expectedUrl: string,
		decodingUrl = false,
		timeout = Timeout.LONG,
	): Promise<void> {
		const normalizedExpectedUrl = this.normalizeUrl(expectedUrl);

		await this.gamdomPage.page.waitForURL(
			(url) => {
				const decodedUrl = decodingUrl
					? decodeURIComponent(url.toString())
					: url.toString();
				return decodedUrl === normalizedExpectedUrl;
			},
			{ timeout },
		);

		let currentUrl = this.gamdomPage.page.url();
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

	@step("Verify OG property value")
	public async verifyMetaOgPropertyValue(
		ogProperty: OgProperties,
		value: OgPropertiesValues,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.getMetaOgPropertyByName(ogProperty),
		).toHaveAttribute(Attributes.CONTENT, value);
	}

	@step("Verify list of OG properties and their values")
	public async verifyOgPropertiesValues(
		ogProperties: OgProperties[],
		expectedValues: string[],
	): Promise<void> {
		expect(
			ogProperties.length,
			`The number of OG properties (${ogProperties.length}) does not match the number of expected values (${expectedValues.length}).`,
		).toBe(expectedValues.length);

		const mismatches: string[] = [];

		for (let i = 0; i < ogProperties.length; i++) {
			const ogProperty = ogProperties[i];
			const expectedValue = expectedValues[i];

			const locator =
				this.gamdomPage.map.getMetaOgPropertyByName(ogProperty);
			const actualValue = await locator.getAttribute(Attributes.CONTENT);

			if (actualValue !== expectedValue) {
				mismatches.push(
					`Mismatch for OG property "${ogProperty}": Expected "${expectedValue}", but got "${actualValue}".`,
				);
			}
		}

		expect(
			mismatches,
			`The following mismatches were found:\n${mismatches.join("\n")}`,
		).toHaveLength(0);
	}

	/**
	 * Verifies that all provided URLs return successful HTTP responses.
	 * Makes requests to each URL and checks for valid status codes.
	 * Automatically prepends the environment URL to relative paths.
	 *
	 * @param urls - Array of URLs to verify
	 * @param options - Optional configuration
	 * @param options.timeout - Request timeout in milliseconds (default: Timeout.MEDIUM)
	 * @param options.failOnError - Whether to fail the test if any link is broken (default: true)
	 * @returns Object containing arrays of valid and broken URLs
	 */
	@step("Verify links are accessible")
	public async verifyLinksAreAccessible(
		urls: string[],
		options: {
			timeout?: number;
			failOnError?: boolean;
		} = {},
	): Promise<{ validUrls: string[]; brokenUrls: string[] }> {
		const { timeout = Timeout.MEDIUM, failOnError = true } = options;

		const validUrls: string[] = [];
		const brokenUrls: string[] = [];

		logger.info(`Checking ${urls.length} URLs for broken links`);

		for (const url of urls) {
			const normalizedUrl = this.normalizeUrl(url);

			try {
				const response = await this.gamdomPage.page.request.get(
					normalizedUrl,
					{
						timeout,
					},
				);

				if (response.ok()) {
					validUrls.push(normalizedUrl);
				} else {
					const statusCode = response.status();
					const statusText = response.statusText();
					const errorMessage = `URL ${normalizedUrl} returned status ${statusCode} (${statusText})`;

					this.handleBrokenLink(
						normalizedUrl,
						errorMessage,
						brokenUrls,
						failOnError,
						response.ok(),
					);
				}
			} catch (error) {
				const errorDetails =
					error instanceof Error ? error.message : String(error);
				const errorMessage = `Failed to access URL: ${normalizedUrl} - ${errorDetails}`;

				this.handleBrokenLink(
					normalizedUrl,
					errorMessage,
					brokenUrls,
					failOnError,
					false,
				);
			}
		}

		return { validUrls, brokenUrls };
	}

	/**
	 * Handles a broken link by logging it, adding it to the broken URLs array, and making the appropriate assertion.
	 *
	 * @param url - The URL that failed
	 * @param errorMessage - The error message to log and include in the assertion
	 * @param brokenUrls - The array to add the broken URL to
	 * @param failOnError - Whether to use a hard or soft assertion
	 * @param condition - The condition to assert (usually false for broken links)
	 * @private
	 */
	private handleBrokenLink(
		url: string,
		errorMessage: string,
		brokenUrls: string[],
		failOnError: boolean,
		condition: boolean,
	): void {
		logger.info(`Broken link found: ${errorMessage}`);
		brokenUrls.push(url);

		if (failOnError) {
			expect(condition, errorMessage).toBeTruthy();
		} else {
			expect.soft(condition, errorMessage).toBeTruthy();
		}
	}

	public async getTextDecoration(locator: Locator): Promise<string> {
		return locator.evaluate((el) => getComputedStyle(el).textDecoration);
	}
}
