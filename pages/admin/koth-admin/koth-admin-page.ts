import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { KothAdminAsserter } from "./koth-admin-page-asserter";
import { KothAdminMap } from "./koth-admin-page-map";
import { KothAdminSteps } from "./koth-admin-page-steps";
import { ADMIN_KOTH_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { formatLocalizedDate } from "@core/utils/utils";
import { KothEventDuration } from "@enums/admin/koth-event-duration";
import { KothMaxWinners } from "@enums/admin/koth-max-winners";

export class KothAdminPage extends BasePage<KothAdminMap> {
	public constructor(page: Page) {
		super(page, new KothAdminMap(page));
	}

	public override assertThat(): KothAdminAsserter {
		return new KothAdminAsserter(this);
	}

	public steps(): KothAdminSteps {
		return new KothAdminSteps(this);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [ADMIN_KOTH_PAGE_ENDPOINT] },
		});
	}

	@step("Set KOTH event start date")
	public async setKothEventStartDate(
		daysOffsetValue?: number,
	): Promise<void> {
		const startDate = formatLocalizedDate({
			daysOffset: daysOffsetValue,
			includeTime: true,
			atMidnight: true,
		});
		await this.map.startEventDateInput.fill(startDate);
	}

	@step("Set KOTH event end date")
	public async setKothEventEndDate(daysOffsetValue?: number): Promise<void> {
		const endDate = formatLocalizedDate({
			daysOffset: daysOffsetValue,
			includeTime: true,
			atMidnight: true,
		});
		await this.map.endEventDateInput.fill(endDate);
	}

	@step("Set end date preset")
	public async setKothEventEndDatePreset(
		days: KothEventDuration,
	): Promise<void> {
		await this.map.endEventDateButton(days).click();
	}

	@step("Set max winners")
	public async setKothEventMaxWinners(
		maxWinners: KothMaxWinners,
	): Promise<void> {
		await this.map.maxUsersInput.fill(maxWinners.toString());
	}

	@step("Set KOTH event prize")
	public async setKothEventPrize(prize: number): Promise<void> {
		await this.map.prizeInput.fill(prize.toString());
	}

	@step("Set KOTH event name")
	public async setKothEventName(name: string): Promise<void> {
		await this.map.eventNameInput.fill(name);
	}

	@step("Click start KOTH event button")
	public async clickStartKothEventButton(): Promise<void> {
		await this.map.startEventButton.click();
	}

	@step("Confirm start KOTH event")
	public async confirmStartKothEvent(): Promise<void> {
		await this.map.confirmStartEventButton.click();
	}
}
