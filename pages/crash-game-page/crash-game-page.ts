import { BasePage } from "@base/base-page";
import { step } from "decorators/step";
import { CRASH_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";
import { Timeout } from "@enums/timeout";
import { Page } from "@playwright/test";
import { sanitizeAmount } from "@support/regex-patterns";
import { CrashGamePageAsserter } from "./crash-game-page-asserter";
import { CrashGamePageMap } from "./crash-game-page-map";
import { CrashGamePageSteps } from "./crash-game-page-steps";
import { VisibilityState } from "@enums/playwright/visibility-states";

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

	@step("Get current bet amount")
	public async getCurrentBetAmount(): Promise<number> {
		const betAmountText = await this.map.betField.inputValue();
		return parseFloat(betAmountText.replace(sanitizeAmount, ""));
	}

	@step("Wait for betting window to be available")
	public async waitBettingWindowAvailable(
		timeout = Timeout.EXTRA_MAX / 2,
	): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.spinningCountdownCounter,
			timeout: timeout,
		});
	}

	@step("Wait for crash")
	public async waitCrash(timeout = Timeout.EXTRA_MAX / 2): Promise<void> {
		await this.map.multiplierCounterCrashed.waitFor({
			state: VisibilityState.ATTACHED,
			timeout: timeout,
		});
	}

	@step("Wait for previous bet round to finish")
	public async waitPreviousBetRoundFinish(
		timeout = Timeout.EXTRA_MAX / 2,
	): Promise<void> {
		await this.assertThat().waitBetBoxAbsent(timeout);
	}

	@step("Get crashed multiplier")
	public async getCrashedMultiplier(): Promise<string> {
		await this.waitCrash();
		return this.map.multiplierCounterCrashed.innerText();
	}

	@step("Get countdown timer")
	public async getCountdownTimer(): Promise<string> {
		await this.assertThat().checkElementsAreVisible(
			[this.map.spinningCountdownCounter],
			Timeout.EXTRA_MAX / 2,
		);
		return this.map.spinningCountdownCounter.innerText();
	}

	@step("Place bet")
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

	@step("Place autobet")
	public async placeAutoBet(
		betAmount: number,
		autoCashoutMultiplier: number,
	): Promise<void> {
		await this.waitPreviousBetRoundFinish();
		await this.waitBettingWindowAvailable();
		await this.fillInBetAmount(betAmount);
		await this.map.autoCashOutField.fill(`${autoCashoutMultiplier}`);
		await this.map.autoPlayBtn.click();
	}

	@step("Fill in bet amount")
	public async fillInBetAmount(betAmount: number): Promise<void> {
		await this.map.betField.fill(String(betAmount));
	}

	@step("Toggle autobet")
	public async toggleAutobet(stopBetAmount?: number): Promise<void> {
		await this.navigate();
		await this.map.autobetToggle.click();
		if (stopBetAmount !== undefined) {
			await this.map.stopBetIfMoreThanField.fill(
				stopBetAmount.toString(),
			);
		}
	}

	@step("Select increase by condition")
	public async selectIncreaseBy(type: BetIncreaseCondition): Promise<void> {
		await this.map.getOnConditionSelectButton(type).click();
		await this.map.getOnConditionOption(type, "Inc").click();
	}

	@step("Fill increase by input")
	public async fillIncreaseByInput(
		type: BetIncreaseCondition,
		value: number,
	): Promise<void> {
		await this.selectIncreaseBy(type);
		await this.map.getIncreaseByInput(type).fill(`${value}`);
	}
}
