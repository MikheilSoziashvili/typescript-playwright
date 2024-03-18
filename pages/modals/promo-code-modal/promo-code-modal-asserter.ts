import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { PromoCodeModal } from "./promo-code-modal";

export class PromoCodeModalAsserter extends BaseAsserter<PromoCodeModal> {
	public constructor(page: PromoCodeModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}
}
