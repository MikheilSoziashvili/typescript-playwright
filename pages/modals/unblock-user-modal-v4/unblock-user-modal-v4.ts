import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { UnblockUserModalMap as UnblockUserModalMap } from "./unblock-user-modal-map-v4";
import { step } from "decorators/step";
import { UnblockUserModalAsserter as UnblockUserModalAsserter } from "./unblock-user-modal-asserter-v4";

export class UnblockUserModal extends BaseModal<UnblockUserModalMap> {
	constructor(page: Page) {
		super(page, new UnblockUserModalMap(page));
	}

	public assertThat(): UnblockUserModalAsserter {
		return new UnblockUserModalAsserter(this);
	}

	@step("Click continue button - v4")
	public async clickUnblockButtonV4(): Promise<void> {
		await this.map.unblockButtonV4.click();
	}

	@step("Click cancel button - v4")
	public async clickCancelButtonV4(): Promise<void> {
		await this.map.cancelButtonV4.click();
	}
}
