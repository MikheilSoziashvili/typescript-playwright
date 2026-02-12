import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { UnauthenticatedHeader } from "@components/header/unauthenticated/unauthenticated-header";
import {
	AcceptDialogOptions,
	BasePageNavigationParametersType,
} from "@core/types/types";
import {
	buildEndpoint,
	conformLinkWithProtocol,
	isElementVisible,
	waitForSeconds,
	waitUntil,
} from "@core/utils/utils";
import { Protocol } from "@enums/api/protocols";
import { Directions } from "@enums/directions";
import { Timeout } from "@enums/timeout";
import { WaitUntilState } from "@enums/wait-until-states";
import { Dialog, Locator, Page } from "@playwright/test";
import { BaseMap } from "./base-map";
import { BoundingBoxCoordinate } from "@enums/bounding-box-coordinates";
import { logger } from "@logger/logger";
import { BrowserName } from "@enums/playwright/project-browser-names";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import { SliderNavigationDirection } from "@enums/playwright/slider-navigation-direction";
import { step } from "decorators/step";
import {
	boundValue,
	calculateCoordinate,
	calculatePercentage,
	getAdjustedTargetValue,
	getDisplayValue,
} from "@formulas/slider-calculations";

type Constructor<T> = new (page: Page) => T;

export abstract class BasePage<T extends BaseMap> {
	private _page: Page;
	private _map: T;

	constructor(page: Page, map: T) {
		this._page = page;
		this._map = map;
	}

	get page(): Page {
		return this._page;
	}

	get map(): T {
		return this._map;
	}

	abstract assertThat(): void;

	/**
	 * Updates the BasePage with a new Page instance.
	 * @param newPage The new Page instance.
	 */
	public init(newPage: Page): void {
		this._page = newPage;
		this._map = new (this._map.constructor as Constructor<T>)(newPage);
	}

	@step("Clear browser cookies")
	public async clearCookies(): Promise<void> {
		await this.page.context().clearCookies();
	}

	@step("Press Enter key")
	public async pressEnterKeyboard(): Promise<void> {
		await this.page.keyboard.press("Enter");
	}

	@step("Press Tab key")
	public async pressTabKeyboard(): Promise<void> {
		await this.page.keyboard.press("Tab");
	}

	@step("Set extra HTTP headers")
	public async setExtraHTTPHeaders(
		headers: Record<string, string> = {},
	): Promise<void> {
		await this.page.context().setExtraHTTPHeaders(headers);
	}

	@step("Navigate to page")
	public async navigate(
		parameters: BasePageNavigationParametersType,
	): Promise<void> {
		if (parameters.cookies?.clearCookies === true) {
			await this.clearCookies();
		}
		if (parameters.endpoint) {
			await this.page.goto(buildEndpoint(parameters.endpoint));
		}
		if (parameters.link) {
			await this.page.goto(
				conformLinkWithProtocol(parameters.link, Protocol.HTTPS),
			);
		}
		await this.page.waitForLoadState();
	}

	@step("Close current page")
	public async closePage(): Promise<void> {
		await this.page.close();
	}

	get authenticatedHeader(): AuthenticatedHeader {
		return new AuthenticatedHeader(this.page);
	}

	get unauthenticatedHeader(): UnauthenticatedHeader {
		return new UnauthenticatedHeader(this.page);
	}

	public steps(): void {
		throw new Error("Method not implemented");
	}

	@step("Refresh page")
	public async refresh(
		waitUntil: WaitUntilState = WaitUntilState.DOM_CONTENT_LOADED,
	): Promise<void> {
		await this.page.reload({ waitUntil });
	}

	@step("Navigate carousel to specific element by index")
	async navigateCarouselElementByIndex(
		carouselItem: Locator,
		leftArrow: Locator,
		rightArrow: Locator,
		index: number,
		timeoutMs = Timeout.MAX,
	): Promise<void> {
		const itemCount = await carouselItem.count();

		if (index < 0 || index >= itemCount) {
			throw new Error(
				`Index out of bounds. Valid range: 0 to ${itemCount - 1}`,
			);
		}

		await waitUntil(
			async () => {
				if (await isElementVisible(carouselItem.nth(index))) {
					return true;
				}

				let currentIndex = -1;
				for (let i = 0; i < itemCount; i++) {
					if (await isElementVisible(carouselItem.nth(i))) {
						currentIndex = i;
						break;
					}
				}

				if (currentIndex === -1) {
					throw new Error("No visible item found in the carousel.");
				}

				const direction =
					index > currentIndex ? Directions.RIGHT : Directions.LEFT;

				if (direction === Directions.RIGHT) {
					await rightArrow.click();
				} else {
					await leftArrow.click();
				}

				return false;
			},
			{
				errorMessage: `Timeout exceeded (${timeoutMs}ms). Element at index ${index} was not visible.`,
				timeoutSeconds: timeoutMs / 1000,
				intervalSeconds: 0.1,
			},
		);
	}

	/**
	 * Retrieves and caches the specified bounding box coordinate (X or Y) of an element.
	 *
	 * @param element - The Playwright Locator of the element to get the position for.
	 * @param axis - The coordinate axis (X or Y) to retrieve.
	 * @returns The numeric position value of the specified axis.
	 * @throws Error if the element's position cannot be determined.
	 */
	@step("Get element position coordinates")
	public async getElementPosition(
		element: Locator,
		axis: BoundingBoxCoordinate,
	): Promise<number> {
		const positionCache: { value?: number } = {};

		positionCache.value ??=
			(await element.boundingBox())?.[axis] ??
			(() => {
				throw new Error(
					`Element position for axis '${axis}' could not be determined.`,
				);
			})();

		return positionCache.value;
	}

	public acceptDialog(options: AcceptDialogOptions = {}): void {
		const { expectedMessage, inputText, times = 1 } = options;
		let remaining = Math.max(1, times);

		const handler = async (dialog: Dialog) => {
			if (
				expectedMessage !== undefined &&
				dialog.message().includes(expectedMessage)
			) {
				await dialog.accept(inputText);
			} else {
				await dialog.accept();
			}

			remaining -= 1;
			if (remaining <= 0) this.page.off("dialog", handler);
		};

		this.page.on("dialog", handler);
	}

	/**
	 * Performs a reliable click on an element, using various strategies if the standard click fails.
	 * This is particularly useful for WebKit browser where click operations can be unstable.
	 *
	 * @param locator - The Playwright Locator for the element to click.
	 * @param options - Optional configuration for the click operation.
	 * @param options.timeout - Maximum time to wait for the element to be visible (default: Timeout.LONG).
	 * @param options.delay - Delay between click attempts (default: Timeout.EXTRA_SHORT / 2).
	 * @param options.ensureVisible - Whether to wait for the element to be visible before clicking (default: true).
	 * @returns A promise that resolves when the click is successful.
	 * @throws Error if all click attempts fail.
	 */
	@step("Perform reliable click with fallback strategies")
	public async performReliableClick(
		locator: Locator,
		options: {
			timeout?: number;
			delay?: number;
			ensureVisible?: boolean;
		} = {},
	): Promise<void> {
		const {
			timeout = Timeout.LONG,
			delay = Timeout.EXTRA_SHORT / 2,
			ensureVisible = true,
		} = options;

		try {
			if (ensureVisible) {
				await locator.waitFor({
					state: VisibilityState.VISIBLE,
					timeout: timeout,
				});
			}

			const page = locator.page();
			const browserName = page.context().browser()?.browserType().name();

			try {
				await locator.click();
				return;
			} catch (e) {
				logger.debug(
					"Standard click failed, attempting alternative methods",
					{
						error: e instanceof Error ? e.message : String(e),
					},
				);
			}

			if (browserName === BrowserName.WEBKIT) {
				const strategies: (() => Promise<boolean>)[] = [
					() => this.waitForElementStability(locator),
					() => this.simpleForceClick(locator),
					() => this.javascriptClick(locator),
					() => this.mouseSimulationClick(locator, page),
					() => this.dispatchClickEvent(locator),
					() => this.clickAtVariousPositions(locator),
					() => this.scrollIntoViewAndClick(locator),
					() => this.doubleScrollAndForceClick(locator, page, delay),
				];

				for (const strategy of strategies) {
					const success = await strategy();
					if (success) return;
				}
			}

			throw new Error("All click attempts failed");
		} catch (error) {
			throw new Error(
				`Failed to click element: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		}
	}

	/**
	 * Attempts to click an element after scrolling it into view.
	 * @param locator - The element to click.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Scroll element into view and click")
	public async scrollIntoViewAndClick(locator: Locator): Promise<boolean> {
		try {
			await locator.scrollIntoViewIfNeeded();
			await locator.click();
			return true;
		} catch (e) {
			logger.debug("Scroll and click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
			return false;
		}
	}

	/**
	 * Attempts to click an element at various positions within its bounding box.
	 * @param locator - The element to click.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Click element at various positions")
	public async clickAtVariousPositions(locator: Locator): Promise<boolean> {
		const positions = [
			{ x: 5, y: 5 },
			{ x: 0, y: 0 },
			{ x: 10, y: 10 },
			{ x: -5, y: -5 },
		];

		for (const position of positions) {
			try {
				await locator.click({ position });
				return true;
			} catch (e) {
				logger.debug(
					`Click at position ${JSON.stringify(position)} failed`,
					{
						error: e instanceof Error ? e.message : String(e),
					},
				);
			}
		}
		return false;
	}

	/**
	 * Attempts to click an element using JavaScript's click() method.
	 * @param locator - The element to click.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Click element using JavaScript")
	public async javascriptClick(locator: Locator): Promise<boolean> {
		try {
			await locator.evaluate((el: HTMLElement) => el.click());
			return true;
		} catch (e) {
			logger.debug("JavaScript click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
			return false;
		}
	}

	/**
	 * Attempts to click an element by simulating mouse movements.
	 * @param locator - The element to click.
	 * @param page - The Playwright Page instance.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Click element using mouse simulation")
	public async mouseSimulationClick(
		locator: Locator,
		page: Page,
	): Promise<boolean> {
		try {
			const box = await locator.boundingBox();
			if (box) {
				await page.mouse.move(
					box.x + box.width / 2,
					box.y + box.height / 2,
				);
				await page.mouse.down();
				await page.mouse.up();
				return true;
			}
		} catch (e) {
			logger.debug("Mouse simulation click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
		}
		return false;
	}

	/**
	 * Attempts to click an element after scrolling twice and using force option.
	 * @param locator - The element to click.
	 * @param page - The Playwright Page instance.
	 * @param delay - Delay in milliseconds before clicking.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Double scroll and force click element")
	public async doubleScrollAndForceClick(
		locator: Locator,
		page: Page,
		delay: number,
	): Promise<boolean> {
		try {
			const selector = await locator.evaluate((el) => {
				let path = "";
				while (el.nodeType === Node.ELEMENT_NODE) {
					path = `${el.tagName}${path}`;
					el = el.parentNode as HTMLElement;
				}
				return path;
			});

			await page.evaluate((selector) => {
				const element = document.querySelector(selector);
				if (element) {
					element.scrollIntoView(true);
					window.scrollBy(0, -100);
				}
			}, selector);

			await waitForSeconds(delay / 1000);
			await locator.click({ force: true }); // eslint-disable-line playwright/no-force-option
			return true;
		} catch (e) {
			logger.debug("Double scroll and force click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
			return false;
		}
	}

	/**
	 * Attempts to click an element using the force option.
	 * @param locator - The element to click.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Force click element")
	public async simpleForceClick(locator: Locator): Promise<boolean> {
		try {
			await locator.click({ force: true }); // eslint-disable-line playwright/no-force-option
			return true;
		} catch (e) {
			logger.debug("Simple force click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
			return false;
		}
	}

	/**
	 * Attempts to click an element by dispatching a click event.
	 * @param locator - The element to click.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Dispatch click event on element")
	public async dispatchClickEvent(locator: Locator): Promise<boolean> {
		try {
			await locator.evaluate((el) => {
				const event = new MouseEvent("click", {
					view: window,
					bubbles: true,
					cancelable: true,
				});
				el.dispatchEvent(event);
			});
			return true;
		} catch (e) {
			logger.debug("DispatchEvent click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
			return false;
		}
	}

	/**
	 * Waits for an element to stabilize its position before clicking.
	 * @param locator - The element to click.
	 * @returns A promise that resolves to true if successful, false otherwise.
	 */
	@step("Wait for element stability before clicking")
	public async waitForElementStability(locator: Locator): Promise<boolean> {
		try {
			const initialBox = await locator.boundingBox();
			await waitForSeconds(0.2);
			const newBox = await locator.boundingBox();

			if (
				initialBox &&
				newBox &&
				Math.abs(initialBox.x - newBox.x) < 1 &&
				Math.abs(initialBox.y - newBox.y) < 1
			) {
				await locator.click();
				return true;
			}
		} catch (e) {
			logger.debug("Wait for stability click failed", {
				error: e instanceof Error ? e.message : String(e),
			});
		}
		return false;
	}

	/**
	 * Attempts to click an element only if it exists. Logs a warning when missing.
	 * @param locator - The element to click.
	 * @param warningMessage - Optional warning message override.
	 * @returns {Promise<boolean>} - True if click happened, false otherwise
	 */
	@step("Click element if present")
	public async clickIfPresent(
		locator: Locator,
		options?: { warningMessage?: string; timeout?: number },
	): Promise<boolean> {
		const timeout = options?.timeout ?? Timeout.SHORT;
		const warningMessage = options?.warningMessage;

		try {
			await locator
				.first()
				.waitFor({ state: VisibilityState.VISIBLE, timeout: timeout });
		} catch {
			logger.warn(
				warningMessage ??
					`Optional locator ${locator.toString()} not found within ${timeout}ms. Skipping click.`,
			);
			return false;
		}

		try {
			await locator.first().click();
			return true;
		} catch (error) {
			logger.warn(
				warningMessage ??
					`Failed to click optional locator ${locator.toString()}.`,
				error,
			);
			return false;
		}
	}

	/**
	 * Retrieves slider bounds (current, min, max values) from ARIA attributes.
	 */
	@step("Get slider bounds from ARIA attributes")
	private async getSliderBounds(sliderThumb: Locator) {
		const currentValue = parseInt(
			(await sliderThumb.getAttribute(Attributes.ARIA_VALUENOW)) || "0",
			10,
		);
		const minValue = parseInt(
			(await sliderThumb.getAttribute(Attributes.ARIA_VALUEMIN)) || "0",
			10,
		);
		const maxValue = parseInt(
			(await sliderThumb.getAttribute(Attributes.ARIA_VALUEMAX)) || "100",
			10,
		);
		return { currentValue, minValue, maxValue };
	}

	/**
	 * Retrieves the current value of a slider element.
	 *
	 * @param sliderContainer - The Playwright Locator for the slider container element.
	 * @returns The current value of the slider as a number.
	 */
	@step("Get slider value")
	public async getSliderValue(sliderContainer: Locator): Promise<number> {
		const sliderThumb = this.map.getSliderThumb(sliderContainer);
		const { currentValue, minValue, maxValue } =
			await this.getSliderBounds(sliderThumb);
		return getDisplayValue(currentValue, minValue, maxValue);
	}

	/**
	 * Adjusts a slider element to a specific value by simulating a drag operation.
	 *
	 * @param sliderContainer - The Playwright Locator for the slider container element.
	 * @param targetValue - The desired value to set the slider to (in display units).
	 * @throws {Error} When the slider bounding box cannot be determined.
	 */
	@step("Adjust slider value")
	public async adjustSliderValue(
		sliderContainer: Locator,
		targetValue: number,
	): Promise<void> {
		const sliderThumb = this.map.getSliderThumb(sliderContainer);
		const { currentValue, minValue, maxValue } =
			await this.getSliderBounds(sliderThumb);

		const adjustedTargetValue = getAdjustedTargetValue(
			targetValue,
			minValue,
			maxValue,
		);
		const boundedTargetValue = boundValue(
			adjustedTargetValue,
			minValue,
			maxValue,
		);
		const percentage = calculatePercentage(
			boundedTargetValue,
			minValue,
			maxValue,
		);

		const sliderTrack = this.map.getSliderTrack(sliderContainer);
		const sliderBox = await sliderTrack.boundingBox();
		if (!sliderBox) {
			throw new Error("Could not get slider bounding box");
		}

		await sliderThumb.focus();

		const targetX = calculateCoordinate(sliderBox, percentage);
		const currentPercentage = calculatePercentage(
			currentValue,
			minValue,
			maxValue,
		);
		const currentX = calculateCoordinate(sliderBox, currentPercentage);
		const centerY = sliderBox.y + sliderBox.height / 2;

		await this.page.mouse.move(currentX, centerY);
		await this.page.mouse.down();
		await this.page.mouse.move(targetX, centerY);
		await this.page.mouse.up();
	}

	@step("Handle file upload")
	public async handleFileUpload(
		uploadButton: Locator,
		filePath: string,
	): Promise<void> {
		const [fileChooser] = await Promise.all([
			this.page.waitForEvent("filechooser"),
			uploadButton.click(),
		]);

		await fileChooser.setFiles(filePath || []);
	}

	/**
	 * Find the index of the currently active (centered) slide in a Swiper slider
	 * @param slideLocators - Array of locators for each slide element
	 * @param activeClassName - The CSS class name that indicates an active slide (default: "swiper-slide-active")
	 * @returns The index of the currently active slide, or -1 if not found
	 */
	@step("Find currently active slide index in slider")
	public async findCurrentActiveSlideIndex(
		slideLocators: Locator[],
		activeClassName: string = AttributesValues.SWIPER_SLIDE_ACTIVE,
	): Promise<number> {
		for (let i = 0; i < slideLocators.length; i++) {
			const slideLocator = slideLocators[i];

			try {
				const exists = await slideLocator.count();
				if (exists === 0) {
					continue;
				}

				const classAttribute = await slideLocator.getAttribute(
					Attributes.CLASS,
				);

				if (classAttribute?.includes(activeClassName)) {
					logger.info(`Currently active slide is at index ${i}`);
					return i;
				}
			} catch {
				continue;
			}
		}

		logger.warn(
			"Could not determine currently active slide, defaulting to previous direction",
		);
		return -1;
	}

	/**
	 * Determine which direction to navigate in a slider based on target and current positions
	 * @param targetIndex - The index of the target slide
	 * @param currentActiveIndex - The index of the currently active slide
	 * @param targetLabel - Optional label for the target (for logging)
	 * @param currentLabel - Optional label for the current active item (for logging)
	 * @returns The direction to navigate (NEXT or PREVIOUS)
	 */
	public determineSliderNavigationDirection(
		targetIndex: number,
		currentActiveIndex: number,
		targetLabel?: string,
		currentLabel?: string,
	): SliderNavigationDirection {
		if (currentActiveIndex === -1) {
			return SliderNavigationDirection.PREVIOUS;
		}

		if (targetIndex < currentActiveIndex) {
			if (targetLabel && currentLabel) {
				logger.info(
					`Target ${targetLabel} (index ${targetIndex}) is to the left of current ${currentLabel} (index ${currentActiveIndex}), clicking previous`,
				);
			}
			return SliderNavigationDirection.PREVIOUS;
		} else {
			if (targetLabel && currentLabel) {
				logger.info(
					`Target ${targetLabel} (index ${targetIndex}) is to the right of current ${currentLabel} (index ${currentActiveIndex}), clicking next`,
				);
			}
			return SliderNavigationDirection.NEXT;
		}
	}

	/**
	 * Navigate a slider in the specified direction by clicking the appropriate button
	 * @param direction - The direction to navigate (NEXT or PREVIOUS)
	 * @param nextButton - The locator for the "next" button
	 * @param previousButton - The locator for the "previous" button
	 * @param targetLabel - Optional label for the target (for logging)
	 * @param attemptNumber - Optional attempt number (for logging)
	 * @returns true if navigation was successful, false if button is disabled
	 */
	@step("Navigate slider in direction")
	public async navigateSliderInDirection(
		direction: SliderNavigationDirection,
		nextButton: Locator,
		previousButton: Locator,
		targetLabel?: string,
		attemptNumber?: number,
	): Promise<boolean> {
		const button =
			direction === SliderNavigationDirection.NEXT
				? nextButton
				: previousButton;

		const isDisabled = await button.isDisabled();
		if (isDisabled) {
			const directionText =
				direction === SliderNavigationDirection.NEXT
					? "Next"
					: "Previous";
			const targetText = targetLabel ? ` to ${targetLabel}` : "";
			logger.warn(
				`${directionText} button is disabled, cannot navigate${targetText}`,
			);
			return false;
		}

		const directionText =
			direction === SliderNavigationDirection.NEXT ? "next" : "previous";
		const targetText = targetLabel ? ` ${targetLabel}` : "";
		const attemptText = attemptNumber ? ` (attempt ${attemptNumber})` : "";
		logger.info(
			`Clicking ${directionText} button to find${targetText}${attemptText}`,
		);

		await button.click();
		return true;
	}
}
