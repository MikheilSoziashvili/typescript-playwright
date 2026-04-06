import { BaseAsserter } from "@pages/base/base-asserter";
import { CasinoCarouselPage } from "./casino-carousel-cms-page";
import { step } from "decorators/step";

export class CasinoCarouselAsserter extends BaseAsserter<CasinoCarouselPage> {
	public constructor(page: CasinoCarouselPage) {
		super(page);
	}

	@step("Verify casino carousel edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
