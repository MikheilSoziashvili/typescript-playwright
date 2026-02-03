import { BaseAsserter } from "@base/base-asserter";
import { TestInfo } from "@playwright/test";
import { Footer } from "./footer";
import { step } from "decorators/step";

export class FooterAsserter extends BaseAsserter<Footer> {
	public constructor(footer: Footer) {
		super(footer);
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

	@step("Footer social media icons block visual correct")
	public async footerSocialMediaIconsBlockVisualCorrect(
		testInfo: TestInfo,
	): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.footerSocialButtons,
		);
	}

	@step("Footer is visible")
	public async footerIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.footerContainer,
		]);
	}
}
