import { BasePageStep } from "@pages/base/base-page-step";
import { LimboBetTestData } from "@dtos/test-data";
import { LimboGamePage } from "./limbo-game-page";
import { waitUntil } from "@core/utils/utils";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { TimeoutSeconds } from "@enums/timeout-seconds";

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

		await this.waitForNewHistoryChip(chipCountBefore);

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

		await this.waitForExpectedBalanceInCoins(expectedCoins);
	}

	@step("Wait for expected balance in coins")
	private async waitForExpectedBalanceInCoins(
		expectedCoins: number,
	): Promise<void> {
		await waitUntil(
			async () => {
				const currentCoins =
					await this.userBalanceHandler.walletBalanceInCoins();

				return currentCoins === expectedCoins;
			},
			{
				errorMessage: `Balance did not update to expected ${expectedCoins} coins`,
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.TEN,
			},
		);
	}

	@step("Wait for new history chip to appear")
	private async waitForNewHistoryChip(
		previousChipCount: number,
	): Promise<void> {
		await waitUntil(
			async () => {
				const currentCount =
					await this.gamdomPage.map.historyChips.count();
				return currentCount > previousChipCount;
			},
			{
				errorMessage:
					"Game result did not appear in history after rolling",
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}

	@step("Navigate to limbo and assert roll button is visible")
	public async navigateAndAssertRollButton(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().rollButtonIsVisible();
	}
}
