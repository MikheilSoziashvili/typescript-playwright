import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { WelcomeBonusModalMap } from "./welcome-bonus-modal-map";
import { WelcomeBonusModalAsserter } from "./welcome-bonus-modal-asserter";
import { step } from "decorators/step";

export class WelcomeBonusModal extends BaseModal<WelcomeBonusModalMap> {
	constructor(page: Page) {
		super(page, new WelcomeBonusModalMap(page));
	}

	public assertThat(): WelcomeBonusModalAsserter {
		return new WelcomeBonusModalAsserter(this);
	}

	@step("Claim code")
	public async claimCode(code: string): Promise<void> {
		await this.map.codeInputFiled.fill(code);
		await this.map.claimButton.click();
	}
}
