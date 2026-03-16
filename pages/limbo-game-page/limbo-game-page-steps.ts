import { BasePageStep } from "@pages/base/base-page-step";
import { LimboBetTestData } from "@dtos/test-data";
import { LimboGamePage } from "./limbo-game-page";
import { step } from "decorators/step";
import { logger } from "@logger/logger";

export class LimboGamePageSteps extends BasePageStep<LimboGamePage> {
	public constructor(gamdomPage: LimboGamePage) {
		super(gamdomPage);
	}

	@step("Play limbo round and verify balance updates")
	public async playAndVerifyBalanceUpdates(
		limboBetData: LimboBetTestData,
	): Promise<void> {
		const initialCoins =
			await this.userBalanceHandler.walletBalanceInCoins();
		const chipCountBefore = await this.gamdomPage.map.historyChips.count();

		const betCoins = this.userBalanceHandler.usdToCoinsTrunc(
			limboBetData.betAmount,
		);

		await this.gamdomPage.fillBetData(limboBetData);
		await this.gamdomPage.clickRoll();
		await this.gamdomPage.waitForNewHistoryChip(chipCountBefore);

		const resultMultiplier =
			await this.gamdomPage.getLastResultMultiplier();
		const isWin = resultMultiplier >= limboBetData.multiplier;

		logger.info(
			`Limbo result: ${resultMultiplier}x, Target: ${limboBetData.multiplier}x, ${isWin ? "WIN" : "LOSS"}`,
		);

		const payoutCoins = isWin
			? this.userBalanceHandler.calculatePayoutCoins(
					betCoins,
					limboBetData.multiplier,
				)
			: 0;
		const expectedCoins = initialCoins - betCoins + payoutCoins;

		await this.gamdomPage.waitForExpectedBalanceInCoins(expectedCoins);
	}

	@step("Navigate to limbo and assert roll button is visible")
	public async navigateAndAssertRollButton(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().rollButtonIsVisible();
	}

	@step("Switch to auto mode and assert start playing button")
	public async switchToAutoModeAndAssertStartPlaying(
		limboBetData: LimboBetTestData,
	): Promise<void> {
		await this.gamdomPage.fillBetData(limboBetData);
		await this.gamdomPage.switchToAutoMode();
		await this.gamdomPage.assertThat().startPlayingButtonIsVisible();
	}

	@step("Start auto play and assert stop playing button")
	public async startAutoPlayAndAssertStopPlaying(): Promise<void> {
		await this.gamdomPage.clickStartPlaying();
		await this.gamdomPage.assertThat().stopPlayingButtonIsVisible();
	}

	@step("Play auto rounds, stop and verify final balance")
	public async playAutoRoundsAndVerifyBalance(
		limboBetData: LimboBetTestData,
		numberOfRounds: number,
		initialCoins: number,
	): Promise<void> {
		const trackedMultipliers =
			await this.gamdomPage.trackAutoRounds(numberOfRounds);

		await this.gamdomPage.clickStopPlaying();
		await this.gamdomPage.assertThat().assertAutobetFinishedToast();
		await this.gamdomPage.waitForAutobetToFullyStop();

		await this.gamdomPage.detectExtraRound(trackedMultipliers);

		const expectedCoins = this.gamdomPage.calculateExpectedBalance(
			initialCoins,
			limboBetData,
			trackedMultipliers,
		);

		await this.gamdomPage.waitForExpectedBalanceInCoins(expectedCoins);
	}
}
