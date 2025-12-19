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

	public get saveChangesButton(): Locator {
		return this.adminCasinoGamesPageHeaderContainer.getByTestId(
			"saveChangesButton",
		);
	}

	public get searchByNameOrCodeContainer(): Locator {
		return this.adminCasinoGamesPageHeaderContainer.getByTestId(
			"searchByNameOrCodeContainer",
		);
	}

	public get searchByNameOrCodeInput(): Locator {
		return this.searchByNameOrCodeContainer.getByTestId(
			"searchByNameOrCodeInput",
		);
	}

	public tableRowByCasinoGameAndProviderName(
		gameName: string,
		providerName: string,
	): Locator {
		return this.adminCasinoGamesPageContent.locator(
			`//tbody//tr[td[contains(@class,"game-name") and text()="${gameName}"] and td[contains(@class,"imported-from") and contains(text(),"${providerName}")]]`,
		);
	}

	public toggleOnOffCasinoGameByCasinoNameAndProviderName(
		gameName: string,
		providerName: string,
	): Locator {
		return this.tableRowByCasinoGameAndProviderName(gameName, providerName)
			.locator('//td//span[@role="button"]')
			.nth(0);
	}
}
