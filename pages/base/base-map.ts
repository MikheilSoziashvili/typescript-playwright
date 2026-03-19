import { waitForSeconds } from "@core/utils/utils";
import { ScrollBehavior } from "@enums/dom/scroll-behaviors";
import { ScrollBlock } from "@enums/dom/scroll-blocks";
import { ScrollInline } from "@enums/dom/scroll-inlines";
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

	async waitForStableBoundingBox(parameters: {
		locator: Locator;
		allowedMovement?: number;
		attempts?: number;
		delayMs?: number;
		failOnTimeout?: boolean;
	}): Promise<void> {
		const {
			locator,
			allowedMovement = 1,
			attempts = 5,
			delayMs = 300,
			failOnTimeout = false,
		} = parameters;

		let previousBox = await locator.boundingBox();
		await waitForSeconds(delayMs / 1000);

		for (let i = 1; i < attempts; i++) {
			const currentBox = await locator.boundingBox();

			if (previousBox && currentBox) {
				const isStable =
					Math.abs(previousBox.x - currentBox.x) <= allowedMovement &&
					Math.abs(previousBox.y - currentBox.y) <= allowedMovement &&
					Math.abs(previousBox.width - currentBox.width) <= allowedMovement &&
					Math.abs(previousBox.height - currentBox.height) <= allowedMovement;

				if (isStable) {
					return;
				}
			}

			previousBox = currentBox;
			await waitForSeconds(delayMs / 1000);
		}

		if (failOnTimeout) {
			throw new Error(
				`Element's bounding box did not stabilize within ${attempts} attempts.`,
			);
		}
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

	async scrollIntoView(
		locator: Locator,
		options: {
			behavior?: ScrollBehavior;
			block?: ScrollBlock;
			inline?: ScrollInline;
		} = {},
	): Promise<void> {
		const {
			behavior = ScrollBehavior.SMOOTH,
			block = ScrollBlock.START,
			inline,
		} = options;
		await locator.evaluate(
			(el, { behavior, block, inline }) => {
				el.scrollIntoView({ behavior, block, inline });
			},
			{ behavior, block, inline },
		);
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

	protected getTableCellLabel(
		labelText: string,
		container?: Locator,
	): Locator {
		return (container || this.page).locator("td", { hasText: labelText });
	}

	protected getTableCellInput(
		labelText: string,
		inputSelector: string,
		container?: Locator,
	): Locator {
		return this.getTableCellLabel(labelText, container).locator(
			`+ td ${inputSelector}`,
		);
	}

	protected getTableCellButton(
		labelText: string,
		buttonText: string,
		container?: Locator,
	): Locator {
		return this.getTableCellLabel(labelText, container).locator(
			"+ td button",
			{ hasText: buttonText },
		);
	}

	public get body(): Locator {
		return this.page.locator("body");
	}

	public getTableRows(tableBody: Locator): Locator {
		return tableBody.locator("tr");
	}

	public getMetaOgPropertyByName(ogProperty: OgProperties): Locator {
		return this.page
			.locator("head")
			.locator(`meta[${Attributes.PROPERTY}='${ogProperty}']`);
	}

	public getSliderThumb(container?: Locator): Locator {
		return (container || this.page).locator(
			`span[${Attributes.ROLE}="slider"][aria-valuemin][aria-valuemax]`,
		);
	}

	public getSliderTrack(container?: Locator): Locator {
		return (container || this.page).locator(
			'span[data-orientation="horizontal"][class*="Formstyled__RangeInput"]',
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
		return 'img[src*="loading-animation-v4.svg"]';
	}

	public async checkboxSelection(
		option: Locator,
		shouldBeSelected: boolean,
	): Promise<void> {
		const isSelected =
			(await option.getAttribute("aria-selected")) === "true";

		if (shouldBeSelected !== isSelected) {
			await option.click();
			await expect(option).toHaveAttribute(
				"aria-selected",
				String(shouldBeSelected),
			);
		}
	}

	public async toggleState(
		toggle: Locator,
		shouldBeChecked: boolean,
	): Promise<void> {
		const checkbox = this.toggleCheckbox(toggle);
		const isChecked = await checkbox.isChecked();

		if (isChecked !== shouldBeChecked) {
			await toggle.click();
			await expect
				.poll(async () => checkbox.isChecked())
				.toBe(shouldBeChecked);
		}
	}

	public fileInput(parent?: Locator): Locator {
		const fileInputSelector = 'input[type="file"]';
		return parent
			? parent.locator(fileInputSelector)
			: this.page.locator(fileInputSelector);
	}

	public toggleCheckbox(toggle: Locator): Locator {
		return toggle.locator('input[type="checkbox"][role="switch"]');
	}
}
