import { BasePageStep } from "../../core/helpers/base-page-step";
import { BetTestData } from "../../dtos/test-data";
import { CrashGamePage } from "./crash-game-page";

export class CrashGamePageSteps extends BasePageStep<CrashGamePage> {
	public constructor(gamdomPage: CrashGamePage) {
		super(gamdomPage);
	}

	public async placeBet(betTestData: BetTestData): Promise<void> {
		await this.gamdomPage.placeBet(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);
		await this.gamdomPage.assertThat().playerBetsAccepted([
			{
				username: betTestData.username,
				betAmount: `${betTestData.betAmount}`,
			},
		]);
		await this.gamdomPage
			.assertThat()
			.playerBetBoxesDisplayed([
				{ betAmount: `${betTestData.betAmount.toFixed(2)}` },
			]);
	}
}
