import { BaseMap } from "@base/base-map";
import { FrameLocator, Locator, Page } from "@playwright/test";

export class EsportsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get sportsIFrame(): FrameLocator {
		return this.page.frameLocator(`iframe[id*='obt-sportsbook']`);
	}

	public get esportsButton(): Locator {
		return this.sportsIFrame.locator("span.text-truncate", {
			hasText: "E-Sports",
		});
	}

	public get featuredMatchesTitle(): Locator {
		return this.sportsIFrame.locator("span.text-truncate", {
			hasText: "Featured Matches",
		});
	}

	public get liveMatchesTitle(): Locator {
		return this.sportsIFrame.locator("span.text-truncate", {
			hasText: "Live matches",
		});
	}
}
