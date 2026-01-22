import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { UnblockUserModalMapV4 as UnblockUserModalMapV4 } from "./unblock-user-modal-map-v4";
import { step } from "decorators/step";
import { UnblockUserModalAsserterV4 as UnblockUserModalAsserterV4 } from "./unblock-user-modal-asserter-v4";

export class UnblockUserModalV4 extends BaseModal<UnblockUserModalMapV4> {
	constructor(page: Page) {
		super(page, new UnblockUserModalMapV4(page));
	}

	public assertThat(): UnblockUserModalAsserterV4 {
		return new UnblockUserModalAsserterV4(this);
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
