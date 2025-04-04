import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CasinoProvidersAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get adminCasinoProvidersPageContent(): Locator {
		return this.page.getByTestId("adminCasinoProvidersPageContent");
	}

	public get adminCasinoProvidersPageHeaderContainer(): Locator {
		return this.adminCasinoProvidersPageContent.getByTestId(
			"adminCasinoProvidersPageHeader",
		);
	}

	public get searchByProviderNameInput(): Locator {
		return this.adminCasinoProvidersPageContent
			.getByTestId("searchByProviderNameContainer")
			.getByTestId("searchByProviderNameInput");
	}
}
