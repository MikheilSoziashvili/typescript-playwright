import { BasePage } from "@base/base-page";
import { CRASH_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { Page, expect } from "@playwright/test";
import { CrashGamePageAsserter } from "./crash-game-page-asserter";
import { CrashGamePageMap } from "./crash-game-page-map";
import { CrashGamePageSteps } from "./crash-game-page-steps";

export class CrashGamePage extends BasePage<CrashGamePageMap> {
	public constructor(page: Page) {
		super(page, new CrashGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CRASH_GAME_PAGE_ENDPOINT] },
		});
		await this.map.waitForVisibility({
			locator: this.map.gameContainer,
		});
	}

	public override assertThat(): CrashGamePageAsserter {
		return new CrashGamePageAsserter(this);
	}

	public steps(): CrashGamePageSteps {
		return new CrashGamePageSteps(this);
	}

	public trackTotalBets(betAmount: number, currentTotal: number): number {
		return currentTotal + betAmount;
	}

	public calculateWinnings(betAmount: number, multiplier: number): number {
		return betAmount * multiplier;
	}

	public calculateExpectedBalance(
		initialBalance: number,
		totalBets: number,
		winnings: number,
	): number {
		return initialBalance - totalBets + winnings;
	}

	public async playUntilMultiplierIs(
		multiplier: number,
		betAmount: number,
		...actions: (() => Promise<void>)[]
	): Promise<void> {
		let isBetWon = false;
		let crashedMultiplier = 0.0;

		while (!isBetWon) {
			logger.info("Starting a new round and placing a bet...");

			for (const action of actions) {
				await action();
			}

			const crashedMultiplierString = await this.getCrashedMultiplier();
			crashedMultiplier = parseFloat(crashedMultiplierString);

			logger.info(`Crashed Multiplier: ${crashedMultiplier}`);

			if (crashedMultiplier >= multiplier) {
				logger.info(
					`Bet won! Multiplier reached: ${crashedMultiplier}. Exiting game...`,
				);
				isBetWon = true;
			} else {
				logger.warn(
					`Bet lost. Multiplier crashed at: ${crashedMultiplier}. Retrying...`,
				);
			}
		}
	}

	public async getCurrentBetAmount(): Promise<number> {
		const betAmountText = await this.map.betField.inputValue();
		return parseFloat(betAmountText);
	}

	public async waitBettingWindowAvailable(
		timeout = Timeout.EXTRA_MAX / 2,
	): Promise<void> {
		await expect(this.map.spinningCountdownCounter).toBeVisible({
			timeout: timeout,
		});
	}

	public async waitCrash(timeout = Timeout.EXTRA_MAX / 2): Promise<void> {
		await expect(this.map.multiplierCounterCrashed).toBeAttached({
			timeout: timeout,
		});
	}

	public async waitPreviousBetRoundFinish(
		timeout = Timeout.EXTRA_MAX / 2,
	): Promise<void> {
		await this.assertThat().waitPlayerBetBoxesAbsent(timeout);
	}

	public async getCrashedMultiplier(): Promise<string> {
		await this.waitCrash();
		const crashedMultiplierText =
			await this.map.multiplierCounterCrashed.innerText();

		return crashedMultiplierText;
	}

	public async placeBet(
		betAmount: number,
		autoCashoutMultiplier: number,
	): Promise<void> {
		await this.waitPreviousBetRoundFinish();
		await this.waitBettingWindowAvailable();
		await this.fillInBetAmount(betAmount);
		await this.map.autoCashOutField.fill(`${autoCashoutMultiplier}`);
		await this.map.placeBetBtn.click();
	}

	public async toggleAutobet(): Promise<void> {
		await this.map.autobetButton.click();
	}

	public async stopBetIfMoreThan(amount: number): Promise<void> {
		await this.map.stopBetIfMoreThanField.fill(amount.toString());
	}

	public async stopAutobetting(): Promise<void> {
		await this.map.placeBetBtn.click();
	}

	public async fillInBetAmount(betAmount: number): Promise<void> {
		await this.map.betField.fill(betAmount.toString());
	}

	/**
	 * Selects an option from the "On Win" or "On Loss" dropdown based on the provided condition and option text.
	 *
	 * @param {"win" | "loss"} condition - Specifies whether to select from the "On Win" or "On Loss" dropdown.
	 * @param {string} option - The text of the option to select within the dropdown.
	 * @returns {Promise<void>} A promise that resolves when the option has been selected.
	 */
	public async selectWinOrLossCondition(
		condition: BetIncreaseCondition,
		option: string,
	): Promise<void> {
		const dropdown =
			condition === "win"
				? this.map.onWinDropdown
				: this.map.onLossDropdown;

		await dropdown.click();

		await this.map.onConditionOption(option).click();
	}

	public async fillIncreaseByInput(increaseByAmount: number): Promise<void> {
		await this.map.increaseByInput.fill(increaseByAmount.toString());
	}
}
