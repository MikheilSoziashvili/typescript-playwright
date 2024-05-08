import { BasePageStep } from "@core/helpers/base-page-step";
import { HiloBetTestData } from "@dtos/test-data";
import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { logger } from "@logger/logger";
import { HiloGamePage } from "./hilo-game-page";

export class HiloGamePageSteps extends BasePageStep<HiloGamePage> {
	public constructor(gamdomPage: HiloGamePage) {
		super(gamdomPage);
	}

	public async playUntilResultColorIs(
		resultColor: HiloGameResultColor,
		testData: HiloBetTestData,
	): Promise<number> {
		let isWin = false;
		let accountBalance =
			await this.gamdomPage.authenticatedHeader.getAccountBalance();

		while (!isWin) {
			await this.gamdomPage.fillInBetAmount(testData.betAmount);
			await this.gamdomPage.placeBet(testData.betOption);
			await this.gamdomPage
				.assertThat()
				.gameMessageIs(HiloGameStatusMessage.DRAWING);
			accountBalance =
				await this.gamdomPage.authenticatedHeader.getAccountBalance();

			const roundresult = await this.gamdomPage.getRoundResult();
			isWin = roundresult.includes(resultColor);

			if (!isWin) {
				logger.info("Hilo game lost! Trying again...");
			}
		}

		return accountBalance;
	}
}
