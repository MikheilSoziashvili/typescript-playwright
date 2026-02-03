import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { ContinueModal } from "./continue-modal";

export class ContinueModalAsserter extends BaseAsserter<ContinueModal> {
	public constructor(page: ContinueModal) {
		super(page);
	}

	@step("Check modal is displayed")
	public async isModalDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.modalLocator]);
	}

	@step("Check modal is not displayed")
	public async isModalNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.modalLocator,
			this.gamdomPage.map.logoutButton,
			this.gamdomPage.map.cancelButton,
		]);
	}

	@step("Check continue and cancel buttons are displayed")
	public async continueAndCancelButtonsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.logoutButton,
			this.gamdomPage.map.cancelButton,
		]);
	}
}
