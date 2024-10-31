import { BaseAsserter } from "@base/base-asserter";
import { TestInfo } from "@playwright/test";
import { Footer } from "./footer";

export class FooterAsserter extends BaseAsserter<Footer> {
	public constructor(footer: Footer) {
		super(footer);
	}

	public async footerSocialMediaIconVisualCorrect(
		testInfo: TestInfo,
		socialMedia: string,
	): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.socialMediaFooterIconByPlaceholder(socialMedia)
		);
	}
}
