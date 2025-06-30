import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { MinesGamePage } from "./mines-game-page";
import { MinesBetTestData } from "@dtos/test-data";

export class MinesGamePageSteps extends BasePageStep<MinesGamePage> {
	public constructor(gamdomPage: MinesGamePage) {
		super(gamdomPage);
	}

	@step("Place bet and configure mines")
	public async placeBetAndConfigureMines(
		minesBetData: MinesBetTestData,
	): Promise<void> {
		await this.gamdomPage.assertThat().insertBetFieldIsDisplayed();
		await this.gamdomPage.insertBet(minesBetData.betAmount);
		await this.gamdomPage.chooseMinesNumber(minesBetData.minesNumber);
	}

	@step("Place manual bet with random tile")
	public async placeManualBetWithRandomTile(
		minesBetData: MinesBetTestData,
	): Promise<void> {
		await this.placeBetAndConfigureMines(minesBetData);
		await this.gamdomPage.startFirstRound(minesBetData.betAmount);
		await this.gamdomPage.performReliableClick(
			this.gamdomPage.map.pickRandomTileButton,
		);
	}

	@step("Perform manual cashout")
	public async performManualCashout(): Promise<void> {
		await this.gamdomPage.assertThat().manualCashoutButtonIsDisplayed();
		await this.gamdomPage.performManualCashout();
	}

	@step("Verify bet is shown in the game history")
	public async verifyBetIsShownInGameHistory(): Promise<void> {
		await this.gamdomPage.openGameHistory();
		await this.gamdomPage.assertThat().verifyGameHistoryModalIsOpened();

		const betRowIndex =
			await this.gamdomPage.getRandomGameHistoryRowIndex();
		const rowBetAmount = await this.gamdomPage.map
			.gameHistoryTableRowBetAmount(betRowIndex)
			.innerText();

		await this.gamdomPage.openBetDetails(betRowIndex);
		await this.gamdomPage.assertThat().verifyBetDetailsModalIsOpened();

		await this.gamdomPage
			.assertThat()
			.verifyBetAmountIsDisplayedInBetDetailsModal(rowBetAmount);
	}
}
