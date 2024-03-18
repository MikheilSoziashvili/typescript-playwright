import { Page } from "@playwright/test";
import { BaseModal } from "../../base/base-modal";
import { ContinueModalMap } from "./continue-modal-map";
import { ContinueModalAsserter } from "./continue-modal-asserter";

export class ContinueModal extends BaseModal<ContinueModalMap> {
	constructor(page: Page) {
		super(page, new ContinueModalMap(page));
	}

	public assertThat(): ContinueModalAsserter {
		return new ContinueModalAsserter(this);
	}

	public async clickContinueButton(): Promise<void> {
		await this.map.continueButton.click();
	}
}
