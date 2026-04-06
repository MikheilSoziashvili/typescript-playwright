import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { HomeCarouselMap } from "./carousel-cms-page-map";
import { HomeCarouselAsserter } from "./carousel-cms-page-asserter";
import { HomeCarouselSteps } from "./carousel-cms-page-steps";
import { CMS_HOME_CAROUSEL_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class HomeCarouselPage extends BasePage<HomeCarouselMap> {
	public constructor(page: Page) {
		super(page, new HomeCarouselMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_HOME_CAROUSEL_ENDPOINT] },
		});
	}

	public override assertThat(): HomeCarouselAsserter {
		return new HomeCarouselAsserter(this);
	}

	public steps(): HomeCarouselSteps {
		return new HomeCarouselSteps(this);
	}
}
