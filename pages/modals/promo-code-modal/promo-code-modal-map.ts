import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class PromoCodeModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promoCodeModalContainer(): Locator {
		return this.page.locator(
			`//div[text()='New Promo Code']//ancestor::div[contains(@class,'MuiPaper-elevation')]`,
		);
	}

	public get promoCodeModalHeader(): Locator {
		return this.promoCodeModalContainer.locator(`[class*='ModalHead-sc-']`);
	}

	public get promoCodeModalBody(): Locator {
		return this.promoCodeModalContainer.locator(`[class*='ModalBody-sc-']`);
	}

	public get promoCodeModalFooter(): Locator {
		return this.promoCodeModalContainer.locator(`[class*='Footer-sc']`);
	}

	public get closePromoCodeModalButton(): Locator {
		return this.promoCodeModalContainer.locator(`button`, {
			has: this.page.locator(`i[class*="icon-remove"]`),
		});
	}
}
