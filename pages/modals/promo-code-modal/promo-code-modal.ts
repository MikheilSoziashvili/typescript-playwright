import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { PromoCodeModalAsserter } from "./promo-code-modal-asserter";
import { PromoCodeModalMap } from "./promo-code-modal-map";
import { Toast } from "@pages/components/toast/toast";
import { ToastTitle } from "@enums/toast-titles";
import { buildCreatedCampaignSubTitle } from "@core/helpers/asserter-helpers/text-asserters";

export class PromoCodeModal extends BasePage<PromoCodeModalMap> {
	constructor(page: Page) {
		super(page, new PromoCodeModalMap(page));
	}

	public assertThat(): PromoCodeModalAsserter {
		return new PromoCodeModalAsserter(this);
	}

	public async createDefaultCashPromoCodeSuccessfully(
		campaignName: string,
		campaignCode: string,
	): Promise<void> {
		await this.map.promoCodeTypeDropdown.click();
		await this.map.promoCodeCashType.click();
		await this.map.campaignNameInput.fill(campaignName);
		await this.map.campaignCodeInput.fill(campaignCode);
		await this.map.createPromoCodeButton.click();
		const toast = new Toast(this.page);
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await toast
			.assertThat()
			.subTitleIs(buildCreatedCampaignSubTitle(campaignName));
	}
}
