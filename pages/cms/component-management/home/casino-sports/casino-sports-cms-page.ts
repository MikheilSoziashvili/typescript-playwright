import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CasinoSportsBannersMap } from "./casino-sports-cms-page-map";
import { CasinoSportsBannersAsserter } from "./casino-sports-cms-page-asserter";
import { CasinoSportsBannersSteps } from "./casino-sports-cms-page-steps";
import { CMS_HOME_CASINO_SPORTS_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class CasinoSportsBannersPage extends BasePage<CasinoSportsBannersMap> {
	public constructor(page: Page) {
		super(page, new CasinoSportsBannersMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_HOME_CASINO_SPORTS_ENDPOINT] },
		});
	}

	public override assertThat(): CasinoSportsBannersAsserter {
		return new CasinoSportsBannersAsserter(this);
	}

	public steps(): CasinoSportsBannersSteps {
		return new CasinoSportsBannersSteps(this);
	}
}
