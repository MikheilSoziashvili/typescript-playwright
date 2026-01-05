import { waitForSeconds, waitUntil } from "@core/utils/utils";
import { BaseVisualSteps } from "@pages/base-visual/base-visual-steps";
import { step } from "decorators/step";
import { SweetBonanzaCandyLandMap } from "./sweet-bonanza-candy-land-map";
import { SweetBonanzaCandyLandPage } from "./sweet-bonanza-candy-land-page";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";

export class SweetBonanzaCandyLandSteps extends BaseVisualSteps {
	protected sweetBonanzaCandyLandPage: SweetBonanzaCandyLandPage;
	protected map: SweetBonanzaCandyLandMap;

	public constructor(sweetBonanzaCandyLandPage: SweetBonanzaCandyLandPage) {
		super(sweetBonanzaCandyLandPage);
		this.sweetBonanzaCandyLandPage = sweetBonanzaCandyLandPage;
		this.map = sweetBonanzaCandyLandPage.map;
	}

	@step("Place win strategy bet")
	public async placeWinStrategyBet(): Promise<void> {
		logger.info("Placing win strategy bet - bet all numbers");
		await this.sweetBonanzaCandyLandPage.clickBetAllNumberButton();
	}

	@step("Place loss strategy bet")
	public async placeLossStrategyBet(): Promise<void> {
		logger.info("Placing loss strategy bet - bet one number");
		await this.sweetBonanzaCandyLandPage.clickBetOneNumberButton();
	}

	@step("Play until win round")
	public async playUntilWinRound(maxRounds: number): Promise<number> {
		return this.playUntilCondition(maxRounds, true);
	}

	@step("Play until loss round")
	public async playUntilLossRound(maxRounds: number): Promise<number> {
		return this.playUntilCondition(maxRounds, false);
	}

	@step("Play until condition met")
	private async playUntilCondition(
		maxRounds: number,
		expectWin: boolean,
	): Promise<number> {
		let roundCount = 0;
		const outcome = expectWin ? "Win" : "Loss";
		const oppositeOutcome = expectWin ? "No win" : "Win detected";

		await waitUntil(
			async () => {
				roundCount++;
				logger.info(`Playing round ${roundCount}`);
				await this.sweetBonanzaCandyLandPage
					.assertThat()
					.waitForBetsBlock();
				await (expectWin
					? this.placeWinStrategyBet()
					: this.placeLossStrategyBet());
				await waitForSeconds(2);
				await this.sweetBonanzaCandyLandPage
					.assertThat()
					.waitForRoundFinish();
				const winLabelExists = await this.sweetBonanzaCandyLandPage
					.assertThat()
					.winLabelExists();
				const conditionMet = winLabelExists === expectWin;

				if (conditionMet) {
					logger.info(
						`${outcome} detected after ${roundCount} rounds`,
					);
				} else {
					logger.info(
						`${oppositeOutcome} after ${roundCount} rounds, retrying...`,
					);
				}

				return conditionMet;
			},
			{
				errorMessage: `${outcome} not detected after ${maxRounds} rounds`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: maxRounds * TimeoutSeconds.ONE_TWENTY,
			},
		);

		return roundCount;
	}
}
