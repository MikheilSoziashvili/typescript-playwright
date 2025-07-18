import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { PromotionsModal } from "./promotions-modal";

export class PromotionsModalAsserter extends BaseAsserter<PromotionsModal> {
	public constructor(page: PromotionsModal) {
		super(page);
	}

	@step("Promotions modal is displayed")
	public async modalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.promotionsModalContainer,
		]);
	}

	@step("Promotions modal is not displayed")
	public async modalIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.promotionsModalContainer,
		]);
	}
}
