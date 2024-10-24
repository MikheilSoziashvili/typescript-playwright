import { BaseAsserter } from "@base/base-asserter";
import { HelpPage } from "./help-page";
import { expect } from "@playwright/test";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export class HelpPageAsserter extends BaseAsserter<HelpPage> {
	public constructor(page: HelpPage) {
		super(page);
	}

	public async isHelpPageTitleVisible(helpPageName: string): Promise<void> {
		await expect(this.gamdomPage.map.helpPageTitle).toHaveText(
			helpPageName,
		);
	}

	public async isHelpPageTabSelected(tabName: string): Promise<void> {
		await this.gamdomPage.map.waitForAttributeToHaveValue(
			this.gamdomPage.map.tabNameByPlaceholder(tabName),
			Attributes.ARIA_SELECTED,
			BooleanValueString.TRUE,
		);
	}
}
