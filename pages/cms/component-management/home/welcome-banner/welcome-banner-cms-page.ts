import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { WelcomeBannerMap } from "./welcome-banner-cms-page-map";
import { WelcomeBannerAsserter } from "./welcome-banner-cms-page-asserter";
import { WelcomeBannerSteps } from "./welcome-banner-cms-page-steps";
import { CMS_HOME_WELCOME_BANNER_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class WelcomeBannerPage extends BasePage<WelcomeBannerMap> {
	public constructor(page: Page) {
		super(page, new WelcomeBannerMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_HOME_WELCOME_BANNER_ENDPOINT] },
		});
	}

	public override assertThat(): WelcomeBannerAsserter {
		return new WelcomeBannerAsserter(this);
	}

	public steps(): WelcomeBannerSteps {
		return new WelcomeBannerSteps(this);
	}
}
