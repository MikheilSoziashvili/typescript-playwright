import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export class WelcomeBonusModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("welcomeBonusModalInner");
	}

	public get claimButton(): Locator {
		return this.modalLocator.getByTestId("welcomeBonusClaimButton");
	}

	public get codeInputFiled(): Locator {
		return this.modalLocator.locator("input");
	}
}
