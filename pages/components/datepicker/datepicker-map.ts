import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class DatepickerMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get datepickerHeader(): Locator {
		return this.page.locator(".rdtPicker:visible .rdtSwitch");
	}

	public get datepickerPrevButton(): Locator {
		return this.page.locator(".rdtPicker:visible .rdtPrev");
	}

	public get datepickerNextButton(): Locator {
		return this.page.locator(".rdtPicker:visible .rdtNext");
	}

	public datepickerCell(
		day: number | string,
		month: number | string,
		year: number | string,
	): Locator {
		const cellSelector = `.rdtPicker:visible td.rdtDay[data-value="${day}"][data-month="${month}"][data-year="${year}"]`;
		return this.page.locator(cellSelector);
	}
}
