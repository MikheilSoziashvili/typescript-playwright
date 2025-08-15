import { BasePage } from "@base/base-page";
import { FREE_SPINS_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Page } from "@playwright/test";
import { FreeSpinsAdminPageAsserter } from "./free-spins-admin-page-asserter";
import { FreeSpinsAdminPageMap } from "./free-spins-admin-page-map";
import { FreeSpinsAdminPageSteps } from "./free-spins-admin-page-steps";
import { Timeout } from "@enums/timeout";
import { DialogInput } from "@enums/admin/dialog-input";

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

	@step("Select game to give free spins")
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

	@step("Give free spins to user")
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

	@step("Revoke free spins")
	public async revokeFreeSpins(): Promise<void> {
		this.acceptDialog({
			expectedMessage: "Note to show to user",
			inputText: DialogInput.REVOKE_FREE_SPINS_REASON,
		});
		await this.map.freeSpinsActionButton.click();
	}

	@step("Get activated free spins")
	public async getActivatedFreeSpins(): Promise<void> {
		await this.map.getFreeSpinsOfUser.click();
	}
}
