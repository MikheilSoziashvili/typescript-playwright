import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { AffiliatesPage } from "./affiliates-page";
import { Timeout } from "@enums/timeout";
import { Attributes } from "@enums/playwright/htmlAttributes";

export class AffiliatesPageAsserter extends BaseAsserter<AffiliatesPage> {
	public constructor(page: AffiliatesPage) {
		super(page);
	}

	public async isCreatedAffiliateCodeVisible(
		affiliateCode: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.createdAffiliatesCodeField,
		).toHaveAttribute(Attributes.VALUE, affiliateCode, {
			timeout: Timeout.EXTRA_LONG, // To be removed when issues with e2e environment are resolved
		});
	}

	public async isCreatedAffiliateCodeVisibleInCopyToClipboardField(
		affiliateCode: string,
	): Promise<void> {
		expect(
			await this.gamdomPage.map.copyCodeToClipboardField.getAttribute(
				Attributes.VALUE,
			),
		).toContain(`/r/${affiliateCode}`);
	}
}
