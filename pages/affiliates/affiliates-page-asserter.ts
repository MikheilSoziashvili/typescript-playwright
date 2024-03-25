import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { AffiliatesPage } from "./affiliates-page";

export class AffiliatesPageAsserter extends BaseAsserter<AffiliatesPage> {
	public constructor(page: AffiliatesPage) {
		super(page);
	}

	public async isCreatedAffiliateCodeVisible(
		affiliateCode: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.createdAffiliatesCodeField,
		).toHaveAttribute("value", affiliateCode);
	}

	public async isCreatedAffiliateCodeVisibleInCopyToClipboardField(
		affiliateCode: string,
	): Promise<void> {
		expect(
			await this.gamdomPage.map.copyCodeToClipboardField.getAttribute(
				"value",
			),
		).toContain(`/r/${affiliateCode}`);
	}
}
