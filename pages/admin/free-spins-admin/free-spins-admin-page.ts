import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { FREE_SPINS_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { FreeSpinsAdminPageMap } from "./free-spins-admin-page-map";
import { FreeSpinsAdminPageAsserter } from "./free-spins-admin-page-asserter";
import { FreeSpinsAdminPageSteps } from "./free-spins-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";

export class FreeSpinsAdminPage extends BasePage<FreeSpinsAdminPageMap> {
	public constructor(page: Page) {
		super(page, new FreeSpinsAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { path: FREE_SPINS_ADMIN_PAGE_ENDPOINT },
		});
	}

	public override assertThat(): FreeSpinsAdminPageAsserter {
		return new FreeSpinsAdminPageAsserter(this);
	}

	public steps(): FreeSpinsAdminPageSteps {
		return new FreeSpinsAdminPageSteps(this);
	}

	public async selectGameToGiveFreeSpins(gameTitle: string): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.findGameToGiveFreeSpinsCardGameTextInput,
		});
		await this.map.findGameToGiveFreeSpinsCardGameTextInput.fill(gameTitle);
		await this.map.findGameToGiveFreeSpinsCardGameField.click();
		await this.map.waitForVisibility({ locator: this.map.gamesList });
		await this.map.getGameLocatorByTitle(gameTitle).click();
	}

	public async giveFreeSpins(parameters: {
		tableRowIndex: number;
		betAmount: number;
	}): Promise<void> {
		const { tableRowIndex, betAmount } = parameters;
		await this.map
			.getPossibleSpinsTableBetCountTextInput(tableRowIndex)
			.fill(betAmount.toString());
		await this.map
			.getPossibleSpinsTableBetCountGiveButton(tableRowIndex)
			.click();
	}
}
