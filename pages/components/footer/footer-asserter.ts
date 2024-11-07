import { BaseAsserter } from "@base/base-asserter";
import { TestInfo } from "@playwright/test";
import { Footer } from "./footer";
import { step } from "decorators/step";

export class FooterAsserter extends BaseAsserter<Footer> {
	public constructor(footer: Footer) {
		super(footer);
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

	@step()
	public async footerSocialMediaIconsBlockVisualCorrect(
		testInfo: TestInfo,
	): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.socialMediaFooterIconsContainer,
		);
	}
}
