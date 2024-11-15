import { BaseAsserter } from "@base/base-asserter";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { expect, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { MaintenancePage } from "./maintenance-page";

export class MaintenancePageAsserter extends BaseAsserter<MaintenancePage> {
	public constructor(page: MaintenancePage) {
		super(page);
	}

	@step()
	public async isSocialMediaLinkCorrect(
		socialMedia: string,
		expectedURL: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.socialMediaFooterLinkByPlaceholder(socialMedia),
		).toHaveAttribute(Attributes.HREF, expectedURL);
	}

	@step()
	public async footerSocialMediaIconVisualCorrect(
		testInfo: TestInfo,
		socialMedia: string,
	): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.socialMediaFooterIconByPlaceholder(socialMedia),
		);
	}
}
