import { Page } from "@playwright/test";
import { BaseModal } from "../../base/base-modal";
import { PromoCodeModalMap } from "./promo-code-modal-map";
import { PromoCodeModalAsserter } from "./promo-code-modal-asserter";

export class PromoCodeModal extends BaseModal<PromoCodeModalMap> {
	constructor(page: Page) {
		super(page, new PromoCodeModalMap(page));
	}

	public assertThat(): PromoCodeModalAsserter {
		return new PromoCodeModalAsserter(this);
	}

	public async claimCode(code: string): Promise<void> {
		await this.map.codeInputFiled.fill(code);
		await this.map.claimButton.click();
	}
}
