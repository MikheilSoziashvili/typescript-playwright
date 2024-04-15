import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";
import { CommonUserPopupOptions } from "../../../enums/common-user-popup-options";

export class CommonUserOptionsPopupMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get popupLocator(): Locator {
		return this.page.locator(
			"div[role=tooltip] div[class*=CommonUserOptionsPopup]",
		);
	}

	public popupOption(option: CommonUserPopupOptions): Locator {
		return this.popupLocator.locator(`ul li:text-is("${option}")`);
	}
}
