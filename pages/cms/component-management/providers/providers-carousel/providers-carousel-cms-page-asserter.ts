import { BaseAsserter } from "@pages/base/base-asserter";
import { ProvidersCarouselPage } from "./providers-carousel-cms-page";
import { step } from "decorators/step";

export class ProvidersCarouselAsserter extends BaseAsserter<ProvidersCarouselPage> {
	public constructor(page: ProvidersCarouselPage) {
		super(page);
	}

	@step("Verify providers carousel edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
