import { BaseAsserter } from "@base/base-asserter";
import { CashVaultIPage } from "./cash-vault-i-page";
import { step } from "decorators/step";

export class CashVaultIPageAsserter extends BaseAsserter<CashVaultIPage> {
	public constructor(page: CashVaultIPage) {
		super(page);
	}

	@step("Verify buy button is visible")
	public async buyButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.buyButton]);
	}

	@step("Verify scratch all button is visible")
	public async scratchAllButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.scratchAllButton,
		]);
	}

	@step("Verify buy button is not visible")
	public async buyButtonIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([this.gamdomPage.map.buyButton]);
	}

	@step("Verify scratch all button is not visible")
	public async scratchAllButtonIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.scratchAllButton,
		]);
	}

	@step("Verify round is finished")
	public async roundIsFinished(): Promise<void> {
		await this.buyButtonIsVisible();
		await this.scratchAllButtonIsNotVisible();
	}
}
