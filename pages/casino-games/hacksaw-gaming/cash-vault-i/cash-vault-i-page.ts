import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import accounting from "accounting";
import { step } from "decorators/step";
import { CashVaultIPageAsserter } from "./cash-vault-i-page-asserter";
import { CashVaultIPageMap } from "./cash-vault-i-page-map";
import { CashVaultIPageSteps } from "./cash-vault-i-page-step";

export class CashVaultIPage extends BasePage<CashVaultIPageMap> {
	public constructor(page: Page) {
		super(page, new CashVaultIPageMap(page));
	}

	public override assertThat(): CashVaultIPageAsserter {
		return new CashVaultIPageAsserter(this);
	}

	public steps(): CashVaultIPageSteps {
		return new CashVaultIPageSteps(this);
	}

	@step("Get ingame balance")
	public async getGameBalance(): Promise<number> {
		const text = (await this.map.gameBalance.innerText()).trim();
		return accounting.unformat(text);
	}

	@step("Click buy button")
	public async clickBuyButton(): Promise<void> {
		await this.map.buyButton.click();
	}

	@step("Click scratch all button")
	public async clickScratchAllButton(): Promise<void> {
		await this.map.scratchAllButton.click();
	}
}
