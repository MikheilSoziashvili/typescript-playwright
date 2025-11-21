import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { LiveBaccaratSqueezePageAsserter } from "./live-baccarat-squeeze-page-asserter";
import { LiveBaccaratSqueezePageMap } from "./live-baccarat-squeeze-page-map";
import { LiveBaccaratSqueezePageSteps } from "./live-baccarat-squeeze-page-step";

export class LiveBaccaratSqueezePage extends BasePage<LiveBaccaratSqueezePageMap> {
	public constructor(page: Page) {
		super(page, new LiveBaccaratSqueezePageMap(page));
	}

	public override assertThat(): LiveBaccaratSqueezePageAsserter {
		return new LiveBaccaratSqueezePageAsserter(this);
	}

	public override steps(): LiveBaccaratSqueezePageSteps {
		return new LiveBaccaratSqueezePageSteps(this);
	}
}
