import { BasePageStep } from "@pages/base/base-page-step";
import { KothAdminPage } from "./koth-admin-page";
import { step } from "decorators/step";
import { KothMaxWinners } from "@enums/admin/koth-max-winners";

export class KothAdminSteps extends BasePageStep<KothAdminPage> {
	public constructor(page: KothAdminPage) {
		super(page);
	}

	@step("Start a new KOTH event")
	public async startNewKothEvent(
		endDateOffset: number,
		prize: number,
		eventName: string,
		maxWinners?: KothMaxWinners,
	): Promise<void> {
		await this.gamdomPage.setKothEventEndDate(endDateOffset);
		await this.gamdomPage.setKothEventMaxWinners(maxWinners ?? 1);
		await this.gamdomPage.setKothEventPrize(prize);
		await this.gamdomPage.setKothEventName(eventName);
		await this.gamdomPage.clickStartKothEventButton();
		await this.gamdomPage.confirmStartKothEvent();
	}
}
