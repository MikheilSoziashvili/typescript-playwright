import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CasinoCarouselMap } from "./casino-carousel-cms-page-map";
import { CasinoCarouselAsserter } from "./casino-carousel-cms-page-asserter";
import { CasinoCarouselSteps } from "./casino-carousel-cms-page-steps";
import { CMS_CASINO_CASINO_CAROUSEL_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class CasinoCarouselPage extends BasePage<CasinoCarouselMap> {
	public constructor(page: Page) {
		super(page, new CasinoCarouselMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_CASINO_CASINO_CAROUSEL_ENDPOINT] },
		});
	}

	public override assertThat(): CasinoCarouselAsserter {
		return new CasinoCarouselAsserter(this);
	}

	public steps(): CasinoCarouselSteps {
		return new CasinoCarouselSteps(this);
	}
}
