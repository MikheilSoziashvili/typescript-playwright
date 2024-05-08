import { Locator, Page } from "@playwright/test";
import { BaseMap } from "base/base-map";

export class UserProfileModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.locator(
			"div.MuiPaper-elevation:has(div[class*=LevelAvatar])",
		);
	}

	public get userAvatar(): Locator {
		return this.page.locator("div[class*=LevelAvatar]");
	}

	public get userProfileTitle(): Locator {
		return this.page.locator("p[class*=profileTitle][breakpointlevel]");
	}

	public get privateStatisticsLocator(): Locator {
		return this.modalLocator.locator(
			'div img[alt=private] + h5:text-is("This user has Private Statistics")',
		);
	}

	public get tipUserButton(): Locator {
		return this.modalLocator.locator(
			'button:has(span:text-is("Tip user"))',
		);
	}

	public get ignoreButton(): Locator {
		return this.modalLocator.locator('button:has(span:text-is("Ignore"))');
	}
}
