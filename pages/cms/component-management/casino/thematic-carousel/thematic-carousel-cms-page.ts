import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { ThematicCarouselMap } from "./thematic-carousel-cms-page-map";
import { ThematicCarouselAsserter } from "./thematic-carousel-cms-page-asserter";
import { ThematicCarouselSteps } from "./thematic-carousel-cms-page-steps";
import { CMS_CASINO_THEMATIC_CAROUSEL_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class ThematicCarouselPage extends BasePage<ThematicCarouselMap> {
	public constructor(page: Page) {
		super(page, new ThematicCarouselMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_CASINO_THEMATIC_CAROUSEL_ENDPOINT] },
		});
	}

	public override assertThat(): ThematicCarouselAsserter {
		return new ThematicCarouselAsserter(this);
	}

	public steps(): ThematicCarouselSteps {
		return new ThematicCarouselSteps(this);
	}
}
