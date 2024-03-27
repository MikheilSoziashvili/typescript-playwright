import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { TipUserModal } from "./tip-user-modal";

export class TipUserModalAsserter extends BaseAsserter<TipUserModal> {
	public constructor(page: TipUserModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}
}
