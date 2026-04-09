import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { expect } from "@playwright/test";
import { AffiliatesInfoPage } from "./affiliates-info-page";

export class AffiliatesInfoPageSteps extends BasePageStep<AffiliatesInfoPage> {
	public constructor(gamdomPage: AffiliatesInfoPage) {
		super(gamdomPage);
	}

	@step("Navigate to affiliates info page and verify it is displayed")
	public async navigateAndVerifyPageIsDisplayed(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().pageIsDisplayed();
	}

	@step("Get Download Templates URL")
	public async getDownloadTemplatesUrl(): Promise<string> {
		await expect(
			this.gamdomPage.map.downloadTemplatesLink,
			"Download Templates link should have an href attribute",
		).toHaveAttribute(Attributes.HREF);
		return (await this.gamdomPage.map.downloadTemplatesLink.getAttribute(Attributes.HREF)) ?? "";
	}

}
