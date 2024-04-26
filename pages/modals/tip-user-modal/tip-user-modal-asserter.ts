import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { TipUserModal } from "./tip-user-modal";

export class TipUserModalAsserter extends BaseAsserter<TipUserModal> {
	public constructor(page: TipUserModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect.soft(this.gamdomPage.map.modalLocator).toBeVisible();
	}

	public async isValueVisible(value: string): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.tipAmountField)
			.toHaveAttribute("value", value);
	}
}
