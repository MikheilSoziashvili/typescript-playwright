import { BaseAsserter } from "@base/base-asserter";
import { HelpPage } from "./help-page";
import { expect } from "@playwright/test";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { step } from "decorators/step";

export class HelpPageAsserter extends BaseAsserter<HelpPage> {
	public constructor(page: HelpPage) {
		super(page);
	}

	@step("Is help page title visible")
	public async isHelpPageTitleVisible(helpPageName: string): Promise<void> {
		await expect(this.gamdomPage.map.helpPageTitle).toHaveText(
			helpPageName,
		);
	}

	@step("Is help page tab selected")
	public async isHelpPageTabSelected(tabName: string): Promise<void> {
		await this.gamdomPage.map.waitForAttributeToHaveValue(
			this.gamdomPage.map.tabNameByPlaceholder(tabName),
			Attributes.ARIA_SELECTED,
			BooleanValueString.TRUE,
		);
	}

	@step("Is text missing in terms of service block")
	public async isTextMissingInTermsOfServiceBlock(
		expectedText: string,
	): Promise<void> {
		const actualTermsOfServiceContainerText =
			await this.gamdomPage.map.helpPageContent.innerText();
		expect(actualTermsOfServiceContainerText).not.toContain(expectedText);
	}

	@step("Verify provably fair link by game name")
	public async verifyProvablyFairLinkByGameName(
		gameName: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.provablyFairLinkByGameName(gameName),
		]);
	}

	@step("Verify sample code section by game name is visible")
	public async verifySampleCodeSectionByGameNameIsVisible(
		gameName: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.sampleCodeSectionByGameName(gameName),
		]);
	}
}
