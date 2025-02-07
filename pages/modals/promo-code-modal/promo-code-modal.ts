import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { PromoCodeModalAsserter } from "./promo-code-modal-asserter";
import { PromoCodeModalMap } from "./promo-code-modal-map";

export class PromoCodeModal extends BasePage<PromoCodeModalMap> {
	constructor(page: Page) {
		super(page, new PromoCodeModalMap(page));
	}

	public assertThat(): PromoCodeModalAsserter {
		return new PromoCodeModalAsserter(this);
	}
}
