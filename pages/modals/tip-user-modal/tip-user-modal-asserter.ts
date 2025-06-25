import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { TipUserModal } from "./tip-user-modal";
import { parseToFloat } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";

export class TipUserModalAsserter extends BaseAsserter<TipUserModal> {
	public constructor(page: TipUserModal) {
		super(page);
	}

	@step("Check tip user modal is displayed")
	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}

	@step("Check tip value is visible")
	public async isValueVisible(value: number): Promise<void> {
		await expect(this.gamdomPage.map.tipAmountField).toHaveAttribute(
			Attributes.VALUE,
			parseToFloat(value),
		);
	}
}
