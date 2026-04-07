import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class HelpPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get helpPageContainer(): Locator {
		return this.page.getByTestId("main-layout-content");
	}

	public get helpPageSidebarContainer(): Locator {
		return this.helpPageContainer.getByTestId("help-sidebar-container");
	}

	public get helpPageSidebarTabList(): Locator {
		return this.helpPageSidebarContainer.getByTestId(
			"help-sidebar-tablist",
		);
	}

	public helpSidebarTabLink(tabName: string): Locator {
		return this.helpPageSidebarTabList.getByRole("link", { name: tabName });
	}

	public helpPageTitle(tabName: string): Locator {
		return this.helpPageSidebarTabList
			.locator("a[aria-current='page']")
			.filter({ hasText: tabName });
	}

	public get howToVerifySection(): Locator {
		return this.helpPageContainer.locator(
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
