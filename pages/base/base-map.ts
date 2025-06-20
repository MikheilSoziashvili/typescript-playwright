import { waitForSeconds } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { OgProperties } from "@enums/playwright/htmlOgProperties";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Locator, Page, expect } from "@playwright/test";

export class BaseMap {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	protected async waitUntilContainsText(
		locator: Locator,
		text: string | RegExp,
		timeout?: number,
	): Promise<Locator> {
		await expect(locator).toContainText(text, { timeout: timeout });
		return locator;
	}

	protected async waitUntilVisible(locator: Locator): Promise<Locator> {
		await expect(locator).toBeVisible();
		return locator;
	}

	async waitFor(parameters: {
		locator: Locator;
		state: VisibilityState;
		timeout?: number;
	}): Promise<void> {
		const { locator, state, timeout } = parameters;
		await locator.waitFor({
			state,
			timeout,
		});
	}

	async waitForVisibility(parameters: {
		locator: Locator;
		timeout?: number;
	}): Promise<void> {
		await this.waitFor({
			...parameters,
			state: VisibilityState.VISIBLE,
		});
	}

	async waitForInvisibility(parameters: {
		locator: Locator;
		timeout?: number;
	}): Promise<void> {
		await this.waitFor({
			...parameters,
			state: VisibilityState.HIDDEN,
		});
	}

	async waitForStableXPosition(parameters: {
		locator: Locator;
		allowedMovement?: number;
		attempts?: number;
		delayMs?: number;
		failOnTimeout?: boolean;
	}): Promise<number> {
		const {
			locator,
			allowedMovement = 1,
			attempts = 5,
			delayMs = 300,
			failOnTimeout = false,
		} = parameters;

		let previousX: number | undefined;
		let currentX: number | undefined;

		for (let i = 0; i < attempts; i++) {
			previousX = currentX;
			currentX = (await locator.boundingBox())?.x;

			if (previousX !== undefined && currentX !== undefined) {
				const delta = Math.abs(previousX - currentX);

				if (delta <= allowedMovement) {
					return currentX;
				}
			}

			await waitForSeconds(delayMs / 1000);
		}

		if (failOnTimeout) {
			throw new Error(
				`Element's X position did not stabilize within ${attempts} attempts.`,
			);
		}

		return currentX ?? 0;
	}

	async waitForAttributeToHaveValue(
		locator: Locator,
		attribute: string,
		expectedValue: string,
		timeout?: number,
	): Promise<void> {
		await expect(locator).toHaveAttribute(attribute, expectedValue, {
			timeout,
		});
	}

	protected getDropdownOptionSelector(
		value: string,
		container?: Locator,
	): Locator {
		return (container || this.page).locator(`li[data-value="${value}"]`);
	}

	protected getComboboxWithText(text: string, container?: Locator): Locator {
		return (container || this.page).locator('div[role="combobox"]', {
			hasText: text,
		});
	}

	protected getInputField(inputField: string, container?: Locator): Locator {
		return (container || this.page).locator(`input[name='${inputField}']`);
	}

	protected getSpanByClassContains(
		partialClassName: string,
		container?: Locator,
	): Locator {
		return (container || this.page).locator(
			`span[class*='${partialClassName}']`,
		);
	}

	public getMetaOgPropertyByName(ogProperty: OgProperties): Locator {
		return this.page
			.locator("head")
			.locator(`meta[${Attributes.PROPERTY}='${ogProperty}']`);
	}

	public getSliderThumb(container?: Locator): Locator {
		return (container || this.page).locator(
			`span[${Attributes.ROLE}="slider"][class*="RangeSliderstyled__Thumb"]`,
		);
	}

	public getSliderTrack(container?: Locator): Locator {
		return (container || this.page).locator(
			'span[class*="RangeSliderstyled__Track"]',
		);
	}

	public getSliderContainerByPlaceholder(
		placeholder: string,
		container?: Locator,
	): Locator {
		return (container || this.page).locator(
			`//div[contains(@class,'Formstyled__Range') and contains(normalize-space(),'${placeholder}')]`,
		);
	}

	public getLoadingAnimation(): Locator {
		return this.page.locator(
			'[data-testid="page-container-animate"] img[alt="gamdom-loading"]',
		);
	}

	public getLoadingAnimationSelector(): string {
	return 'img[alt="gamdom-loading"]';
}
}
