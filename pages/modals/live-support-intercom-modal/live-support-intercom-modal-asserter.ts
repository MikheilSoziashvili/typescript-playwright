import { BaseAsserter } from "@base/base-asserter";
import { expect } from "@playwright/test"
import { step } from "decorators/step";
import { LiveSupportModal } from "./live-support-intercom-modal";

export class LiveSupportModalAsserter extends BaseAsserter<LiveSupportModal> {
	public constructor(page: LiveSupportModal) {
		super(page);
	}
	@step("Live Support intercom modal is displayed")
	public async isDisplayed(): Promise<void> {
		await expect(
			this.gamdomPage.map.liveSupportIntercomIframe,
		).toBeVisible();
	}
}
