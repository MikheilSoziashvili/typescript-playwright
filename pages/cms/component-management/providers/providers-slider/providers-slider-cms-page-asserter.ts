import { BaseAsserter } from "@pages/base/base-asserter";
import { ProvidersSliderPage } from "./providers-slider-cms-page";
import { step } from "decorators/step";

export class ProvidersSliderAsserter extends BaseAsserter<ProvidersSliderPage> {
	public constructor(page: ProvidersSliderPage) {
		super(page);
	}

	@step("Verify providers slider edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
