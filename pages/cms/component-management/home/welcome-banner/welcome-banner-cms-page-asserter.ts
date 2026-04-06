import { BaseAsserter } from "@pages/base/base-asserter";
import { WelcomeBannerPage } from "./welcome-banner-cms-page";
import { step } from "decorators/step";

export class WelcomeBannerAsserter extends BaseAsserter<WelcomeBannerPage> {
	public constructor(page: WelcomeBannerPage) {
		super(page);
	}

	@step("Verify welcome banner edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.pageHeading,
			this.gamdomPage.map.desktopBannerSection,
			this.gamdomPage.map.mobileBannerSection,
		]);
	}
}
