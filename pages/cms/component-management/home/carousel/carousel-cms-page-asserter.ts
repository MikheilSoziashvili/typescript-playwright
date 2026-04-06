import { BaseAsserter } from "@pages/base/base-asserter";
import { HomeCarouselPage } from "./carousel-cms-page";
import { step } from "decorators/step";

export class HomeCarouselAsserter extends BaseAsserter<HomeCarouselPage> {
	public constructor(page: HomeCarouselPage) {
		super(page);
	}

	@step("Verify carousel edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
