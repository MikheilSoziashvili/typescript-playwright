import { Page, expect } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { CrashGamePageMap } from "./crash-game-page-map";
import { CrashGamePageAsserter } from "./crash-game-page-asserter";
import { CrashGamePageSteps } from "./crash-game-page-steps";
import { logger } from "@logger/logger";
import { CRASH_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class CrashGamePage extends BasePage<CrashGamePageMap> {
	public constructor(page: Page) {
		super(page, new CrashGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { path: CRASH_GAME_PAGE_ENDPOINT },
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

	public async waitBettingWindowAvailable(timeout = 90): Promise<void> {
		await expect(this.map.spinningCountdownCounter).toBeAttached({
			timeout: timeout * 1000,
		});
	}

	public async waitCrash(timeout = 90): Promise<void> {
		await expect(this.map.multiplierCounterCrashed).toBeAttached({
			timeout: timeout * 1000,
		});
	}

	public async getCrashedMultiplier(waitCrashTimeout = 60): Promise<string> {
		await this.waitCrash(waitCrashTimeout);
		const crashedMultiplierText =
			await this.map.multiplierCounterCrashed.innerText();

		return crashedMultiplierText;
	}

	public async placeBet(
		betAmount: number,
		autoCashoutMultiplier: number,
	): Promise<void> {
		await this.waitBettingWindowAvailable();
		await this.map.betField.fill(`${betAmount}`);
		await this.map.autoCashOutField.fill(`${autoCashoutMultiplier}`);
		await this.map.placeBetBtn.click();
	}
}
