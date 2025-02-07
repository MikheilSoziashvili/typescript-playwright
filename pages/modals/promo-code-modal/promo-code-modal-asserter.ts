import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { PromoCodeModal } from "./promo-code-modal";

export class PromoCodeModalAsserter extends BaseAsserter<PromoCodeModal> {
	public constructor(page: PromoCodeModal) {
		super(page);
	}

	@step("Promo code modal is displayed")
	public async isDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.promoCodeModalHeader,
			this.gamdomPage.map.promoCodeModalBody,
			this.gamdomPage.map.promoCodeModalFooter,
		]);
	}

	@step("Promo code modal is not displayed")
	public async isNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.promoCodeModalHeader,
			this.gamdomPage.map.promoCodeModalBody,
			this.gamdomPage.map.promoCodeModalFooter,
		]);
	}
}
