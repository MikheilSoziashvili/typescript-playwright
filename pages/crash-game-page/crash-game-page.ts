import { Page, expect } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { CrashGamePageMap } from "./crash-game-page-map";
import { CrashGamePageAsserter } from "./crash-game-page-asserter";
import { CrashGamePageSteps } from "./crash-game-page-steps";
import { logger } from "@logger/logger";
import { parseMultiplier } from "@core/utils/utils";
import { CRASH_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class CrashGamePage extends BasePage<CrashGamePageMap> {
	public constructor(page: Page) {
		super(page, new CrashGamePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(CRASH_GAME_PAGE_ENDPOINT);
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

	public async playUntilMultiplierIs(
		multiplier: number,
		...actions: (() => Promise<void>)[]
	): Promise<void> {
		let crashedMultiplier = 0.0;
		do {
			if (crashedMultiplier == 0.0) {
				logger.info("New Crash game will be opened");
			} else if (
				crashedMultiplier > 0.0 &&
				crashedMultiplier < multiplier
			) {
				logger.warn(
					"Multiplier crashed below expected. Will retry bet...",
				);
			}

			for (const action of actions) {
				await action();
			}

			crashedMultiplier = parseMultiplier(
				await this.getCrashedMultiplier(),
			);
		} while (crashedMultiplier < multiplier);
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
