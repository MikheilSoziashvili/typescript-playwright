import { BasePageStep } from "@pages/base/base-page-step";
import { MinesGamePage } from "./mines-game-page";
import { MinesBetTestData } from "@dtos/test-data";

export class MinesGamePageSteps extends BasePageStep<MinesGamePage> {
	public constructor(gamdomPage: MinesGamePage) {
		super(gamdomPage);
	}

	public async placeBetAndConfigureMines(
		minesBetData: MinesBetTestData,
	): Promise<void> {
		await this.gamdomPage.assertThat().insertBetFieldIsDisplayed();
		await this.gamdomPage.insertBet(minesBetData.betAmount);
		await this.gamdomPage.chooseMinesNumber(minesBetData.minesNumber);
	}

	public async placeManualBetWithRandomTile(
		minesBetData: MinesBetTestData,
	): Promise<void> {
		await this.placeBetAndConfigureMines(minesBetData);
		await this.gamdomPage.startFirstRound(minesBetData.betAmount);
		await this.gamdomPage.performReliableClick(
			this.gamdomPage.map.pickRandomTileButton,
		);
	}

	public async performManualCashout(): Promise<void> {
		await this.gamdomPage.assertThat().manualCashoutButtonIsDisplayed();
		await this.gamdomPage.performManualCashout();
	}
}
