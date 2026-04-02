import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { FiatDepositModalAsserter } from "./fiat-deposit-modal-asserter";
import { FiatDepositModalMap } from "./fiat-deposit-modal-map";
import { FiatDepositModalSteps } from "./fiat-deposit-modal-steps";

export class FiatDepositModal extends BasePage<FiatDepositModalMap> {
	public constructor(page: Page) {
		super(page, new FiatDepositModalMap(page));
	}

	public override assertThat(): FiatDepositModalAsserter {
		return new FiatDepositModalAsserter(this);
	}

	public steps(): FiatDepositModalSteps {
		return new FiatDepositModalSteps(this);
	}

	@step("Click Got it button")
	public async clickGotIt(): Promise<void> {
		await this.map.gotItButton.click();
	}

	@step("Click Contact Support button")
	public async clickContactSupport(): Promise<void> {
		await this.map.contactSupportButton.click();
	}

	@step("Close fiat deposit modal")
	public async close(): Promise<void> {
		await this.map.closeButton.click();
	}
}
