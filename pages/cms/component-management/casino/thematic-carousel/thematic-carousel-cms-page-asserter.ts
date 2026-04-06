import { BaseAsserter } from "@pages/base/base-asserter";
import { ThematicCarouselPage } from "./thematic-carousel-cms-page";
import { step } from "decorators/step";

export class ThematicCarouselAsserter extends BaseAsserter<ThematicCarouselPage> {
	public constructor(page: ThematicCarouselPage) {
		super(page);
	}

	@step("Verify thematic carousel edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
