import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { AffiliatesInfoPage } from "./affiliates-info-page";

export class AffiliatesInfoPageAsserter extends BaseAsserter<AffiliatesInfoPage> {
	public constructor(page: AffiliatesInfoPage) {
		super(page);
	}

	@step("Check affiliates info page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.heroTitle]);
	}
}
