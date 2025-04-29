import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { PromoCodeModal } from "./promo-code-modal";
import { Toast } from "@pages/components/toast/toast";
import { ToastTitle } from "@enums/toast-titles";
import { buildCreatedCampaignSubTitle } from "@core/helpers/asserter-helpers/text-asserters";

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

	@step("Verify promo code creation toast")
	public async verifyPromoCodeCreationToast(
		campaignName: string,
	): Promise<void> {
		const toast = new Toast(this.gamdomPage.page);
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await toast
			.assertThat()
			.subTitleIs(buildCreatedCampaignSubTitle(campaignName));
	}
}
