import { expect, TestInfo } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { GeoblockedPage } from "./geoblocked-page";
import { GeoblockedCountry } from "@enums/geoblocked-countries";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { Timeout } from "@enums/timeout";

export class GeoblockedPageAsserter extends BaseAsserter<GeoblockedPage> {
	public constructor(page: GeoblockedPage) {
		super(page);
	}

	@step("Is geoblocked error title displayed")
	public async isGeoblockedErrorTitleDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.errorTitleLocator).toHaveText(
			"Gamdom is not available in your Country",
			{ timeout: Timeout.MAX },
		);
	}

	@step("Is blocked country name displayed")
	public async isBlockedCountryNameDisplayed(
		countryName: GeoblockedCountry,
	): Promise<void> {
		await expect(this.gamdomPage.map.errorSubTitleLocator).toHaveText(
			countryName,
		);
	}

	@step("Is social media link correct")
	public async isSocialMediaLinkCorrect(
		socialMedia: string,
		expectedURL: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.socialMediaFooterLinkByPlaceholder(socialMedia),
		).toHaveAttribute(Attributes.HREF, expectedURL);
	}

	@step("Footer social media icon visual correct")
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
