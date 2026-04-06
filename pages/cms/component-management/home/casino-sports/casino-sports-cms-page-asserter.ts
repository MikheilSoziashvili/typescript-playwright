import { BaseAsserter } from "@pages/base/base-asserter";
import { CasinoSportsBannersPage } from "./casino-sports-cms-page";
import { step } from "decorators/step";

export class CasinoSportsBannersAsserter extends BaseAsserter<CasinoSportsBannersPage> {
	public constructor(page: CasinoSportsBannersPage) {
		super(page);
	}

	@step("Verify casino & sportsbetting banners edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
