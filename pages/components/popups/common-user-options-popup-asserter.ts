import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { CommonUserOptionsPopup } from "./common-user-options-popup";

export class CommonUserOptionsPopupAsserter extends BaseAsserter<CommonUserOptionsPopup> {
	public constructor(popup: CommonUserOptionsPopup) {
		super(popup);
	}

	@step("Check popup is displayed")
	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.popupLocator).toBeVisible();
	}

	@step("Check popup is displayed - v4")
	public async isDisplayedV4(): Promise<void> {
		await expect(this.gamdomPage.map.popupLocatorV4).toBeVisible();
	}
}
