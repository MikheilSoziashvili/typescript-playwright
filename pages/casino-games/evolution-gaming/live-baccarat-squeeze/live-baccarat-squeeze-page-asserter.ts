import { BaseAsserter } from "@base/base-asserter";
import { waitUntil } from "@core/utils/utils";
import {
	BaccaratBetSpot,
	BaccaratGameResultMessage,
} from "@enums/baccarat-game-options";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { LiveBaccaratSqueezePage } from "./live-baccarat-squeeze-page";

export class LiveBaccaratSqueezePageAsserter extends BaseAsserter<LiveBaccaratSqueezePage> {
	public constructor(page: LiveBaccaratSqueezePage) {
		super(page);
	}

	@step("Game is ready to start")
	public async gameReadyToStart(): Promise<void> {
		await waitUntil(
			async () => {
				try {
					await this.checkElementsAreVisible(
						[
							this.gamdomPage.map.gameStartTimer,
							this.gamdomPage.map.betsContainerAvailable,
							this.gamdomPage.map.chipsStackAvailableContainer,
						],
						Timeout.EXTRA_SHORT,
					);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage:
					"Game did not start - timer, bets container, or chips stack not available",
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}

	@step("Wait for game round result to appear")
	public async gameRoundResultAppeared(): Promise<void> {
		await waitUntil(
			async () => {
				try {
					await this.checkElementsAreVisible(
						[this.gamdomPage.map.gameResultContainer],
						Timeout.EXTRA_SHORT,
					);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: "Game result container not available",
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}

	@step("Verify game round result and get winning amount")
	public async verifyGameRoundResultAndGetWinningAmount(
		expectedBetSpots: BaccaratBetSpot[],
	): Promise<{ winner: string; amount: string }> {
		const [winnerText, amountText] = await Promise.all([
			this.gamdomPage.map.gameResultWinner.textContent(),
			this.gamdomPage.map.gameResultAmount.textContent(),
		]);

		const winner = winnerText?.trim() ?? "";
		const amount = amountText?.trim() ?? "";

		const normalizedSpots = expectedBetSpots.map((spot) =>
			spot.toUpperCase(),
		);

		if (normalizedSpots.includes(winner)) {
			await expect(this.gamdomPage.map.gameResultMessage).toContainText(
				BaccaratGameResultMessage.YOU_WIN,
			);
		}

		return { winner, amount };
	}
}
