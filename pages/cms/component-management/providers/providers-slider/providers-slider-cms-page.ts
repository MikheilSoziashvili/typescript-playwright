import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { ProvidersSliderMap } from "./providers-slider-cms-page-map";
import { ProvidersSliderAsserter } from "./providers-slider-cms-page-asserter";
import { ProvidersSliderSteps } from "./providers-slider-cms-page-steps";
import { CMS_PROVIDERS_SLIDER_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class ProvidersSliderPage extends BasePage<ProvidersSliderMap> {
	public constructor(page: Page) {
		super(page, new ProvidersSliderMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_PROVIDERS_SLIDER_ENDPOINT] },
		});
	}

	public override assertThat(): ProvidersSliderAsserter {
		return new ProvidersSliderAsserter(this);
	}

	public steps(): ProvidersSliderSteps {
		return new ProvidersSliderSteps(this);
	}
}
