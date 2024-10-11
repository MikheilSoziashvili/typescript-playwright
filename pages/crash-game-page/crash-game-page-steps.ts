import { BasePageStep } from "@pages/base/base-page-step";
import { parseToFloat } from "@core/utils/utils";
import { BetTestData } from "@dtos/test-data";
import { CrashGamePage } from "./crash-game-page";

export class CrashGamePageSteps extends BasePageStep<CrashGamePage> {
	public constructor(gamdomPage: CrashGamePage) {
		super(gamdomPage);
	}

	public async placeBet(betTestData: BetTestData): Promise<void> {
		const accountBalanceBeforeBet =
			await this.gamdomPage.authenticatedHeader.getAccountBalance();

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
				{ betAmount: parseToFloat(betTestData.betAmount) },
			]);
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(accountBalanceBeforeBet - betTestData.betAmount);
	}

	public async toggleAutobetSetup(
		betTestData: BetTestData,
		stopBetAmount: number,
	): Promise<void> {
		await this.gamdomPage.toggleAutobet();
		await this.gamdomPage.stopBetIfMoreThan(stopBetAmount);
	}
}
