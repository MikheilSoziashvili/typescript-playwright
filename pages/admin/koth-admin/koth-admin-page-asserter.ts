import { BaseAsserter } from "@pages/base/base-asserter";
import { KothAdminPage } from "./koth-admin-page";
import { step } from "decorators/step";
import { KOTH_END_DATES_MAP } from "@constants/koth-end-dates-map";
import { KothEventDuration } from "@enums/admin/koth-event-duration";
import { currencyToNumberPattern } from "@support/regex-patterns";
import { expect } from "@playwright/test";
import { getISODate } from "@core/utils/utils";

export class KothAdminAsserter extends BaseAsserter<KothAdminPage> {
	public constructor(page: KothAdminPage) {
		super(page);
	}

	@step("Verify end date is set properly from Preset button")
	public async kothEndDateInput(days: KothEventDuration): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.endEventDateInput,
				expectedValue: KOTH_END_DATES_MAP[days].toString(),
			},
		]);
	}

	@step("Verify created event name in Active Events table")
	public async kothEventNameIsPresentInActiveEvents(
		eventName: string,
	): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.getEventName(eventName),
				expectedText: eventName,
			},
		]);
	}

	@step("Verify prize amount in Active Events table")
	public async kothEventPrizeAmountIsPresentInActiveEvents(
		eventName: string,
		prize: number,
	): Promise<void> {
		const prizeAmount = await this.gamdomPage.map
			.getEventPrize(eventName)
			.innerText();
		const parsedPrizeAmount = parseFloat(
			prizeAmount.replace(currencyToNumberPattern, ""),
		);
		expect(parsedPrizeAmount).toBe(prize);
	}

	@step("Verify Max winners in Active Events table")
	public async kothEventMaxWinnersIsPresentInActiveEvents(
		eventName: string,
		maxWinners: number,
	): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.getMaxWinners(eventName),
				expectedText: maxWinners.toString(),
			},
		]);
	}

	@step("Verify event end date in Active Events table")
	public async kothEventEndDateIsPresentInActiveEvents(
		eventName: string,
		daysOffset: number,
	): Promise<void> {
		const formatedDate = getISODate({ daysOffset });
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.getEventEndDate(eventName),
				expectedText: formatedDate,
			},
		]);
	}
}
