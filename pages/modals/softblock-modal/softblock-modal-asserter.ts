import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { SoftblockModalPage } from "./softblock-modal";
import { expect } from "@playwright/test";

export class SoftblockModalAsserter extends BaseAsserter<SoftblockModalPage> {
	public constructor(page: SoftblockModalPage) {
		super(page);
	}

	@step("Check softblock modal is displayed")
	public async isDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.softblockModal,
		]);
	}

	@step("Check softblock modal is not displayed")
	public async isNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.softblockModal,
		]);
	}

	@step("Check softblock modal has correct title")
	public async hasCorrectTitle(expectedTitle: string): Promise<void> {
		await expect(this.gamdomPage.map.softblockModalTitle).toHaveText(
			expectedTitle,
		);
	}
}
