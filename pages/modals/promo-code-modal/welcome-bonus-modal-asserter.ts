import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { WelcomeBonusModal } from "./welcome-bonus-modal";

export class WelcomeBonusModalAsserter extends BaseAsserter<WelcomeBonusModal> {
	public constructor(page: WelcomeBonusModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}
}
