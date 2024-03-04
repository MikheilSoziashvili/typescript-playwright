import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";
import { OriginalGame } from "../../enums/original-games";
import { decimalNumber } from "../../support/regex-patterns";

export class GooglePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get gEmailField(): Locator {
		return this.page.locator("#identifierId");
	}

	public get gMoveForwardBtn(): Locator {
		return this.page.locator("#identifierNext > div > button > span");
	}

	public get gPasswordField(): Locator {
		return this.page.locator("input[name='Passwd']");
	}

	public get gPasswordNextBtn(): Locator {
		return this.page.locator("#passwordNext > div > button > span");
	}
}
