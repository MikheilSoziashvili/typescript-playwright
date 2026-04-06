import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { ProvidersCarouselMap } from "./providers-carousel-cms-page-map";
import { ProvidersCarouselAsserter } from "./providers-carousel-cms-page-asserter";
import { ProvidersCarouselSteps } from "./providers-carousel-cms-page-steps";
import { CMS_PROVIDERS_CAROUSEL_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class ProvidersCarouselPage extends BasePage<ProvidersCarouselMap> {
	public constructor(page: Page) {
		super(page, new ProvidersCarouselMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_PROVIDERS_CAROUSEL_ENDPOINT] },
		});
	}

	public override assertThat(): ProvidersCarouselAsserter {
		return new ProvidersCarouselAsserter(this);
	}

	public steps(): ProvidersCarouselSteps {
		return new ProvidersCarouselSteps(this);
	}
}
