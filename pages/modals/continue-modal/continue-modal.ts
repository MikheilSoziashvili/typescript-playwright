import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { ContinueModalMap } from "./continue-modal-map";
import { ContinueModalAsserter } from "./continue-modal-asserter";
import { step } from "decorators/step";

export class ContinueModal extends BaseModal<ContinueModalMap> {
	constructor(page: Page) {
		super(page, new ContinueModalMap(page));
	}

	public assertThat(): ContinueModalAsserter {
		return new ContinueModalAsserter(this);
	}

	@step("Click continue button")
	public async clickLogoutButton(): Promise<void> {
		await this.map.logoutButton.click();
	}

	@step("Click cancel button")
	public async clickCancelButton(): Promise<void> {
		await this.map.cancelButton.click();
	}
}
