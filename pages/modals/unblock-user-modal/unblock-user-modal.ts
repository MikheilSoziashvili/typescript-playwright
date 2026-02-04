import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { step } from "decorators/step";
import { UnblockUserModalMap } from "./unblock-user-modal-map";
import { UnblockUserModalAsserter } from "./unblock-user-modal-asserter";

export class UnblockUserModal extends BaseModal<UnblockUserModalMap> {
	constructor(page: Page) {
		super(page, new UnblockUserModalMap(page));
	}

	public assertThat(): UnblockUserModalAsserter {
		return new UnblockUserModalAsserter(this);
	}

	@step("Click continue button")
	public async clickUnblockButton(): Promise<void> {
		await this.map.unblockButton.click();
	}

	@step("Click cancel button")
	public async clickCancelButton(): Promise<void> {
		await this.map.cancelButton.click();
	}
}
