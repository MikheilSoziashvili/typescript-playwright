import { BaseComponent } from "@pages/base/base-component";
import { Locator, Page } from "@playwright/test";
import { DatepickerAsserter } from "./datepicker-asserter";
import { DatepickerMap } from "./datepicker-map";
import { DatepickerSteps } from "./datepicker-steps";
import { step } from "decorators/step";
import { extractDateParts, getTargetDate } from "@core/utils/datetime-utils";

export class Datepicker extends BaseComponent<DatepickerMap> {
	constructor(page: Page) {
		super(page, new DatepickerMap(page));
	}

	public assertThat(): DatepickerAsserter {
		return new DatepickerAsserter(this);
	}

	public steps(): DatepickerSteps {
		return new DatepickerSteps(this);
	}

	@step("Close datepicker")
	public async closeDatepicker(): Promise<void> {
		await this.map.body.click({ position: { x: 0, y: 0 } });
	}

	@step("Pick a date relative to today")
	public async pickDateRelativeIn(
		input: Locator,
		offset: number,
	): Promise<void> {
		await input.click();

		const targetDate = getTargetDate(offset);
		const { day, month, year } = extractDateParts(targetDate);

		const { visibleMonth, visibleYear } =
			await this.getVisibleMonthAndYear();

		await this.navigateToTargetMonthYear(
			visibleMonth,
			visibleYear,
			month,
			year,
			targetDate,
		);

		await this.selectDateCell(day, month, year);
		await this.closeDatepicker();
	}

	@step("Get visible month and year in datepicker header")
	private async getVisibleMonthAndYear(): Promise<{
		visibleMonth: number;
		visibleYear: number;
	}> {
		const visibleHeaderText =
			(await this.map.datepickerHeader.textContent())?.trim() ?? "";
		const [visibleMonthName, visibleYearStr] = visibleHeaderText.split(" ");
		const visibleYear = Number(visibleYearStr);
		const visibleMonth = new Date(
			`${visibleMonthName} 1, ${visibleYear}`,
		).getMonth();

		return { visibleMonth, visibleYear };
	}

	@step("Navigate to target month and year")
	private async navigateToTargetMonthYear(
		visibleMonth: number,
		visibleYear: number,
		targetMonth: number,
		targetYear: number,
		targetDate: Date,
	): Promise<void> {
		if (targetMonth === visibleMonth && targetYear === visibleYear) {
			return;
		}

		const prevButton = this.map.datepickerPrevButton;
		const targetLabel = `${targetDate.toLocaleString("default", {
			month: "long",
		})} ${targetYear}`;

		while (
			(await this.map.datepickerHeader.textContent())?.trim() !==
			targetLabel
		) {
			await prevButton.click();
		}
	}

	@step("Select date cell in calendar grid")
	private async selectDateCell(
		day: number,
		month: number,
		year: number,
	): Promise<void> {
		const cell = this.map.datepickerCell(day, month, year);
		await cell.click();
	}
}
