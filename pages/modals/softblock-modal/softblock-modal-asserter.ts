import { BaseAsserter } from "@pages/base/base-asserter";
import { SoftblockModalPage } from "./softblock-modal";
import { expect } from "@playwright/test";

export class SoftblockModalAsserter extends BaseAsserter<SoftblockModalPage> {
	public constructor(page: SoftblockModalPage) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.softblockModal,
		]);
	}

	public async isNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.softblockModal,
		]);
	}

	public async hasCorrectTitle(expectedTitle: string): Promise<void> {
		await expect(this.gamdomPage.map.softblockModalTitle).toHaveText(
			expectedTitle,
		);
	}
}
