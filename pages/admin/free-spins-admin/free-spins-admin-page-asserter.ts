import { BaseAsserter } from "@base/base-asserter";
import { FreeSpinsAdminPage } from "./free-spins-admin-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";

export class FreeSpinsAdminPageAsserter extends BaseAsserter<FreeSpinsAdminPage> {
	public constructor(page: FreeSpinsAdminPage) {
		super(page);
	}

	@step("Free spins are revoked")
	public async freeSpinsAreRevoked(): Promise<void> {
		await expect(this.gamdomPage.map.freeSpinsActionButton).toBeEmpty();
	}
}
