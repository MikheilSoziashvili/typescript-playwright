import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { UnblockUserModal } from "./unblock-user-modal";

export class UnblockUserModalAsserter extends BaseAsserter<UnblockUserModal> {
	public constructor(page: UnblockUserModal) {
		super(page);
	}

	@step("Check modal is displayed")
	public async isDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.modalLocator]);
	}

	@step("Check modal is not displayed")
	public async isNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.modalLocator,
			this.gamdomPage.map.unblockButton,
			this.gamdomPage.map.cancelButton,
		]);
	}

	@step("Check continue and cancel buttons are displayed")
	public async unblockAndCancelButtonsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.unblockButton,
			this.gamdomPage.map.cancelButton,
		]);
	}
}
