import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { FaqPage } from "./faq-page";

export class FaqPageAsserter extends BaseAsserter<FaqPage> {
	public constructor(page: FaqPage) {
		super(page);
	}

	public async isAffiliateCodeVisible(affiliateCode: string): Promise<void> {
		expect(
			await this.gamdomPage.map.affiliateUnderCodeLinkButtonLocator.textContent(),
		).toEqual(affiliateCode);
	}
}
