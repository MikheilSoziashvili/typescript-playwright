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
		const valueText =
			(await this.gamdomPage.map.createdAffiliatesCodeField.getAttribute(
				"value",
			)) || "";
		expect(valueText).toEqual(affiliateCode);
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
