import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { ContinueModal } from "./continue-modal";

export class ContinueModalAsserter extends BaseAsserter<ContinueModal> {
	public constructor(page: ContinueModal) {
		super(page);
	}

	@step("Check modal is displayed")
	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}

	@step("Check modal is not displayed")
	public async isNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.modalLocator,
			this.gamdomPage.map.continueButton,
			this.gamdomPage.map.cancelButton,
		]);
	}

	@step("Check continue and cancel buttons are displayed")
	public async continueAndCancelButtonsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.continueButton,
			this.gamdomPage.map.cancelButton,
		]);
	}
}
