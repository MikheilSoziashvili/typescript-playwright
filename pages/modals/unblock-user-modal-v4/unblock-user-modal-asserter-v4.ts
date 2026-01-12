import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { UnblockUserModal } from "./unblock-user-modal-v4";

export class UnblockUserModalAsserter extends BaseAsserter<UnblockUserModal> {
	public constructor(page: UnblockUserModal) {
		super(page);
	}

	@step("Check modal is displayed - v4")
	public async isDisplayedV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.modalLocatorV4,
		]);
	}

	@step("Check modal is not displayed - v4")
	public async isNotDisplayedV4(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.modalLocatorV4,
			this.gamdomPage.map.unblockButtonV4,
			this.gamdomPage.map.cancelButtonV4,
		]);
	}

	@step("Check continue and cancel buttons are displayed - v4")
	public async unblockAndCancelButtonsDisplayedV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.unblockButtonV4,
			this.gamdomPage.map.cancelButtonV4,
		]);
	}
}
