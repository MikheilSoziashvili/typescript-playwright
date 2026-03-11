import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { BetTestData } from "@dtos/test-data";
import { CrashGamePage } from "./crash-game-page";
import { logger } from "@logger/logger";
import {
	BetIncreaseCondition,
	CrashBetItemStatus,
} from "@enums/crash-autobet-section";
import { Timeout } from "@enums/timeout";
import { VisibilityState } from "@enums/playwright/visibility-states";

export class CrashGamePageSteps extends BasePageStep<CrashGamePage> {
	public constructor(gamdomPage: CrashGamePage) {
		super(gamdomPage);
	}

	// ── Single bet flow ──────────────────────────────────────────────

	@step("Place bet and verify registration")
	public async placeBetAndVerify(
		betTestData: BetTestData,
		options?: { autobet?: boolean },
	): Promise<void> {
		const balanceBefore =
			await this.userBalanceHandler.walletBalanceInFiatRounded();

		await this.prepareBet(betTestData, options);
		await this.gamdomPage
			.assertThat()
			.betIsRegistered(betTestData, balanceBefore);
	}

	@step("Prepare bet")
	private async prepareBet(
		betTestData: BetTestData,
		options?: { autobet?: boolean },
	): Promise<void> {
		if (options?.autobet) {
			await this.gamdomPage.placeAutoBet(
				betTestData.betAmount,
				betTestData.autoCashoutMultiplier,
			);
		} else {
			await this.gamdomPage.placeBet(
				betTestData.betAmount,
				betTestData.autoCashoutMultiplier,
			);
		}
	}

	// ── Play until win loop ──────────────────────────────────────────

	@step("Play until multiplier is achieved")
	public async playUntilMultiplierIs(
		betTestData: BetTestData,
		options?: { autobet?: boolean },
	): Promise<{
		accountBalanceBeforePlay: number;
		totalBetsPlaced: number;
		winnings: number;
	}> {
		const accountBalanceBeforePlay =
			await this.userBalanceHandler.walletBalanceInFiatRounded();

		const winnings = this.gamdomPage.calculateWinnings(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);

		let totalBetsPlaced = 0;

		while (true) {
			await this.placeBetAndVerify(betTestData, options);
			totalBetsPlaced += betTestData.betAmount;

			const won = await this.waitForRoundResult(winnings);

			if (won) {
				return { accountBalanceBeforePlay, totalBetsPlaced, winnings };
			}
		}
	}

	@step("Wait for round result")
	private async waitForRoundResult(winnings: number): Promise<boolean> {
		const timeout = Timeout.EXTRA_MAX / 2;

		const won = await this.raceAutoCashoutVsCrash(timeout);

		if (won) {
			logger.info("Bet won! Auto-cashout triggered.");
			await this.assertBetWon(winnings);
			return true;
		}

		logger.warn("Bet lost. Crashed before auto-cashout. Retrying...");
		return false;
	}

	private raceAutoCashoutVsCrash(timeout: number): Promise<boolean> {
		const successPromise = async (): Promise<boolean> => {
			await this.gamdomPage.map.betItemButton
				.filter({ hasText: CrashBetItemStatus.SUCCESS })
				.waitFor({ state: VisibilityState.ATTACHED, timeout: timeout });
			return true;
		};

		const crashPromise = async (): Promise<boolean> => {
			await this.gamdomPage.map.multiplierCounterCrashed.waitFor({
				state: VisibilityState.ATTACHED,
				timeout: timeout,
			});
			return false;
		};

		return Promise.race([successPromise(), crashPromise()]);
	}

	@step("Assert bet won with success and payout")
	private async assertBetWon(winnings: number): Promise<void> {
		await this.gamdomPage.assertThat().betWonSuccess();
		await this.gamdomPage.assertThat().paidOutDisplayed(winnings);
	}

	// ── Autobet flow ─────────────────────────────────────────────────

	@step("Enable autobet and fill amount")
	public async enableAutobetAndFillAmount(betAmount: number): Promise<void> {
		await this.gamdomPage.toggleAutobet();
		await this.gamdomPage.fillInBetAmount(betAmount);
		await this.gamdomPage.assertThat().startAutobetButtonIsEnabled();
	}

	@step("Start autobet")
	public async startAutobet(betAmount: number): Promise<void> {
		await this.enableAutobetAndFillAmount(betAmount);
		await this.gamdomPage.map.autoPlayBtn.click();
		await this.gamdomPage.assertThat().checkElementsContainText([
			{
				locator: this.gamdomPage.map.autoPlayBtn,
				expectedText: "Stop auto bet",
			},
		]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([
				this.gamdomPage.map.stopBetIfMoreThanField,
			]);
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.gamdomPage.map.autoPlayBtn.click();
		await this.gamdomPage.assertThat().checkElementsContainText([
			{
				locator: this.gamdomPage.map.autoPlayBtn,
				expectedText: "Start auto bet",
			},
		]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([
				this.gamdomPage.map.stopBetIfMoreThanField,
			]);
	}

	// ── Autobet increase-by flow ─────────────────────────────────────

	@step("Setup autobet with increase by")
	public async setupAutobetWithIncreaseBy(
		betTestData: BetTestData,
		stopBetAmount: number,
		increaseCondition: BetIncreaseCondition,
		increaseMultiplier: number,
	): Promise<void> {
		await this.gamdomPage.toggleAutobet(stopBetAmount);
		await this.gamdomPage.fillIncreaseByInput(
			increaseCondition,
			increaseMultiplier,
		);
	}

	@step("Autobet until bet more than threshold")
	public async autobetUntilBetMoreThan(
		betTestData: BetTestData,
		stopIfBetMoreThanAmount: number,
		increaseByMultiplier: number,
		increaseCondition: BetIncreaseCondition,
	): Promise<void> {
		await this.waitForBettingWindowOrSkip();

		await this.gamdomPage.placeAutoBet(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);

		let previousBetAmount = betTestData.betAmount;

		while (
			(await this.gamdomPage.getCurrentBetAmount()) <=
			stopIfBetMoreThanAmount
		) {
			const betWon = await this.processAutobetRound(
				betTestData.autoCashoutMultiplier,
			);

			previousBetAmount = await this.verifyBetAmountAfterRound(
				previousBetAmount,
				betWon,
				increaseCondition,
				increaseByMultiplier,
				betTestData.betAmount,
			);
		}

		logger.info(
			`Bet amount exceeded stop limit ${stopIfBetMoreThanAmount}. Exiting.`,
		);
	}

	@step("Wait for betting window or skip if timer too low")
	private async waitForBettingWindowOrSkip(): Promise<void> {
		const timerValue = parseFloat(
			await this.gamdomPage.getCountdownTimer(),
		);

		if (timerValue <= 4) {
			logger.warn(
				`Timer too low (${timerValue}s). Waiting for next round.`,
			);
			await this.gamdomPage.waitCrash();
			await this.gamdomPage.waitBettingWindowAvailable();
		}
	}

	@step("Process autobet round")
	private async processAutobetRound(
		autoCashoutMultiplier: number,
	): Promise<boolean> {
		const crashedMultiplier = parseFloat(
			await this.gamdomPage.getCrashedMultiplier(),
		);
		const betWon = crashedMultiplier >= autoCashoutMultiplier;

		logger.info(
			`Multiplier: ${crashedMultiplier} — ${betWon ? "Won" : "Lost"}`,
		);

		return betWon;
	}

	@step("Verify bet amount after round")
	private async verifyBetAmountAfterRound(
		previousBetAmount: number,
		betWon: boolean,
		increaseCondition: BetIncreaseCondition,
		increaseByMultiplier: number,
		baseBetAmount: number,
	): Promise<number> {
		await this.gamdomPage.waitBettingWindowAvailable();
		return this.gamdomPage
			.assertThat()
			.verifyBetAmountUpdatedCorrectly(
				previousBetAmount,
				betWon,
				increaseCondition,
				increaseByMultiplier,
				baseBetAmount,
			);
	}
}
