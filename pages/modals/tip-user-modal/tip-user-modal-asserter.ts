import { expect } from "@playwright/test";
import { BaseAsserter } from "base/base-asserter";
import { TipUserModal } from "./tip-user-modal";
import { parseToFloat } from "core/utils";

export class TipUserModalAsserter extends BaseAsserter<TipUserModal> {
	public constructor(page: TipUserModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}

	public async isValueVisible(value: number): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.tipAmountField)
			.toHaveAttribute("value", parseToFloat(value));
	}
}
