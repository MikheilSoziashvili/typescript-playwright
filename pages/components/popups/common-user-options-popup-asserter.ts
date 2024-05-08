import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { CommonUserOptionsPopup } from "./common-user-options-popup";

export class CommonUserOptionsPopupAsserter extends BaseAsserter<CommonUserOptionsPopup> {
	public constructor(popup: CommonUserOptionsPopup) {
		super(popup);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.popupLocator).toBeVisible();
	}
}
