import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class HelpPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get helpPageContainer(): Locator {
		return this.page.getByTestId("page-container-animate");
	}

	public get helpPageTitle(): Locator {
		return this.helpPageContainer
			.getByTestId("help-page-header-wrapper")
			.locator("h1");
	}

	public get helpPageContent(): Locator {
		return this.helpPageContainer.getByTestId("help-page-content-wrapper");
	}

	public get helpPageHeaderTabsContainer(): Locator {
		return this.helpPageContainer.getByTestId(
			"help-page-header-tabs-container",
		);
	}

	public tabNameByPlaceholder(placeholderText: string): Locator {
		return this.helpPageHeaderTabsContainer.getByTestId(
			`${placeholderText}-tab`,
		);
	}

	public get howToVerifySection(): Locator {
		return this.helpPageContent.locator(
			`//h2[normalize-space()="How to verify"]`,
		);
	}

	public sampleCodeSectionByGameName(gameName: string): Locator {
		return this.howToVerifySection.locator(
			`xpath=./following-sibling::div[contains(., "${gameName}")]`,
		);
	}

	public provablyFairLinkByGameName(gameName: string): Locator {
		return this.sampleCodeSectionByGameName(gameName).locator(`a`);
	}
}
