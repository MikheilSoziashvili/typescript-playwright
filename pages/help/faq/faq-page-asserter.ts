import { expect } from "@playwright/test";
import { BaseAsserter } from "../../base/base-asserter";
import { FaqPage } from "./faq-page";

export class FaqPageAsserter extends BaseAsserter<FaqPage> {
	public constructor(page: FaqPage) {
		super(page);
	}

	public async isAffiliateCodeVisible(affiliateCode: string): Promise<void> {
		await expect(
			this.gamdomPage.map.affiliateUnderCodeLinkButtonLocator,
		).toHaveText(affiliateCode);
	}
}
