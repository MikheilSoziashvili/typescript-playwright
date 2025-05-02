import { BasePage } from "@base/base-page";
import { FREE_SPINS_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { FreeSpinsAdminPageAsserter } from "./free-spins-admin-page-asserter";
import { FreeSpinsAdminPageMap } from "./free-spins-admin-page-map";
import { FreeSpinsAdminPageSteps } from "./free-spins-admin-page-steps";
import { Timeout } from "@enums/timeout";

export class FreeSpinsAdminPage extends BasePage<FreeSpinsAdminPageMap> {
	public constructor(page: Page) {
		super(page, new FreeSpinsAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [FREE_SPINS_ADMIN_PAGE_ENDPOINT] },
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

		const gameLocator = this.map.getGameLocatorByTitle(gameTitle);
		await this.map.waitForVisibility({
			locator: gameLocator,
			timeout: Timeout.MEDIUM,
		});
		await gameLocator.click();
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
