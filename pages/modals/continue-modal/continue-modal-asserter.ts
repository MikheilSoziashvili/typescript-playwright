import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { ContinueModal } from "./continue-modal";

export class ContinueModalAsserter extends BaseAsserter<ContinueModal> {
	public constructor(page: ContinueModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}
}
