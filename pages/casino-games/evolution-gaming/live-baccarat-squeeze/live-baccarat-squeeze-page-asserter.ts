import { BaseAsserter } from "@base/base-asserter";
import { waitForSeconds, waitUntil } from "@core/utils/utils";
import {
	BaccaratBetSpot,
	BaccaratGameResultMessage,
} from "@enums/baccarat-game-options";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { LiveBaccaratSqueezePage } from "./live-baccarat-squeeze-page";

export class LiveBaccaratSqueezePageAsserter extends BaseAsserter<LiveBaccaratSqueezePage> {
	public constructor(page: LiveBaccaratSqueezePage) {
		super(page);
	}

	@step("Wait for loader popup to disappear")
	public async waitForLoaderPopupToDisappear(): Promise<void> {
		logger.info("Waiting for game frame to load...");
		await waitForSeconds(TimeoutSeconds.FIVE);

		await waitUntil(
			async () => {
				const isLoaderVisible =
					await this.gamdomPage.map.loaderPopup.isVisible();

				if (isLoaderVisible) {
					logger.info("Loader popup is visible, refreshing page...");
					await this.gamdomPage.page.reload();
					await waitForSeconds(TimeoutSeconds.FIVE);
					return false;
				}

				logger.info("Loader popup is not visible");
				return true;
			},
			{
				errorMessage:
					"Loader popup is still visible after multiple refreshes",
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: TimeoutSeconds.THIRTY,
			},
		);
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
		const winnerText =
			await this.gamdomPage.map.gameResultWinner.textContent();
		const winner = winnerText?.trim() ?? "";

		const normalizedSpots = expectedBetSpots.map((spot) =>
			spot.toUpperCase(),
		);

		const isWin = normalizedSpots.includes(winner);

		if (isWin) {
			await expect(this.gamdomPage.map.gameResultMessage).toContainText(
				BaccaratGameResultMessage.YOU_WIN,
			);
			const amountText =
				await this.gamdomPage.map.gameResultAmount.textContent();
			const amount = amountText?.trim() ?? "";
			return { winner, amount };
		}

		const amount = "";
		return { winner, amount };
	}
}
