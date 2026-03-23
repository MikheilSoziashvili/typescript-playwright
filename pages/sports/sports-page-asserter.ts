import { BaseAsserter } from "@pages/base/base-asserter";
import { SportsPage } from "./sports-page";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { step } from "decorators/step";

export class SportsAsserter extends BaseAsserter<SportsPage> {
	public constructor(page: SportsPage) {
		super(page);
	}

	@step("Self exclusion toast message is displayed")
	public async selfExclusionToastMessageIsDisplayed(): Promise<void> {
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(ToastTitle.FAILED, ToastSubTitle.SELF_EXCLUSION);
	}
}
