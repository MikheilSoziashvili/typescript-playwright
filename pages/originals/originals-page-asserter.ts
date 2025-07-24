import { OriginalGames } from "@core/types/types";
import { OriginalGame } from "@enums/original-games";
import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { OriginalsPage } from "./originals-page";

export class OriginalsAsserter extends BaseAsserter<OriginalsPage> {
	public constructor(page: OriginalsPage) {
		super(page);
	}

	@step("Assert that the bet amount is correct for game {game}")
	public async betAmountIsCorrect(
		game: OriginalGames,
		expected: number,
	): Promise<void> {
		const actualBetAmount = await this.gamdomPage
			.steps()
			.getBetAmountValue(game, expected);
		this.expectRoundedToBe(actualBetAmount, expected);
	}

	@step("Assert that the bet amount is set to the minimum for {game}")
	public async betAmountIsMin(game: OriginalGame): Promise<void> {
		await this.betAmountIsCorrect(
			game,
			this.gamdomPage.getMinBetAmount(game),
		);
	}

	@step("Assert that the bet amount is set to the maximum for {game}")
	public async betAmountIsMax(game: OriginalGame): Promise<void> {
		await this.betAmountIsCorrect(
			game,
			this.gamdomPage.getMaxBetAmount(game),
		);
	}

	@step("Assert that the bet amount remains unchanged after negative input")
	public async betAmountRemainsUnchangedAfterNegativeInput(
		game: OriginalGame,
		expectedBetAmount: number,
	): Promise<void> {
		const currentBetAmount = await this.gamdomPage
			.steps()
			.getBetAmountValue(game, expectedBetAmount);
		this.expectRoundedToBe(currentBetAmount, expectedBetAmount);
	}
}
