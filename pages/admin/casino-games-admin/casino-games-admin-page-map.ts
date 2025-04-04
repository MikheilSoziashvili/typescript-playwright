import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CasinoGamesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get adminCasinoGamesPageContent(): Locator {
		return this.page.getByTestId("adminCasinoGamesPageContent");
	}

	public get adminCasinoGamesPageHeaderContainer(): Locator {
		return this.adminCasinoGamesPageContent.getByTestId(
			"adminCasinoGamesPageHeader",
		);
	}

	public get downloadGamesCsvButton(): Locator {
		return this.adminCasinoGamesPageContent
			.getByTestId("downloadGamesContainer")
			.getByTestId("downloadGamesButton");
	}
}
