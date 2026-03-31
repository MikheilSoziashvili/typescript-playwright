import { BasePage } from "@base/base-page";
import { PLINKO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { parseBalance, waitUntil } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { expect, Locator, Page } from "@playwright/test";
import { step } from "decorators/step";
import { PlinkoGamePageAsserter } from "./plinko-game-page-asserter";
import { PlinkoGamePageMap } from "./plinko-game-page-map";
import { PlinkoGamePageSteps } from "./plinko-game-page-steps";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class PlinkoGamePage extends BasePage<PlinkoGamePageMap> {
	public constructor(page: Page) {
		super(page, new PlinkoGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PLINKO_GAME_PAGE_ENDPOINT] },
		});
	}

	public steps(): PlinkoGamePageSteps {
		return new PlinkoGamePageSteps(this);
	}

	public override assertThat(): PlinkoGamePageAsserter {
		return new PlinkoGamePageAsserter(this);
	}

	@step("Open login modal")
	public async openLoginModal(): Promise<void> {
		await this.map.signInButton.click();
	}

	@step("Click autobet")
	public async clickAutobet(): Promise<void> {
		await this.map.autoBetButton.click();
	}

	@step("Fill in bet amount")
	public async fillInBetAmount(betAmount: string | number): Promise<void> {
		await this.map.waitForStableXPosition({
			locator: this.map.betAmountInput,
		});
		await this.map.betAmountInput.fill(betAmount.toString());
	}

	@step("Type bet amount")
	public async typeInBetAmount(betAmount: string): Promise<void> {
		await this.map.waitForStableXPosition({
			locator: this.map.betAmountInput,
		});
		await this.map.betAmountInput.pressSequentially(betAmount);
	}

	@step("Define slider values")
	public async defineSliderValues(options?: {
		rowsValue?: number;
		riskValue?: number;
	}): Promise<void> {
		if (options?.rowsValue !== undefined) {
			await this.adjustSliderValue(
				this.map.betRowsSliderContainer,
				options.rowsValue,
			);
		}

		if (options?.riskValue !== undefined) {
			await this.adjustSliderValue(
				this.map.riskRowsSliderContainer,
				options.riskValue,
			);
		}
	}

	@step("Drop ball")
	public async dropBall(): Promise<void> {
		await this.map.dropBallButton.click();
	}

	@step("Start manual bet")
	public async startManualBet(
		betAmount: number | string,
		options?: { rowsValue?: number; riskValue?: number },
	): Promise<void> {
		await this.fillInBetAmount(betAmount);

		if (options?.rowsValue !== undefined) {
			await this.adjustSliderValue(
				this.map.betRowsSliderContainer,
				options.rowsValue,
			);
		}

		if (options?.riskValue !== undefined) {
			await this.adjustSliderValue(
				this.map.riskRowsSliderContainer,
				options.riskValue,
			);
		}

		await this.dropBall();
	}

	@step("Get rows slider value")
	public async getRowsSliderValue(): Promise<number> {
		return this.getSliderValue(this.map.betRowsSliderContainer);
	}

	@step("Get risk slider value")
	public async getRiskSliderValue(): Promise<number> {
		return this.getSliderValue(this.map.riskRowsSliderContainer);
	}

	@step("Get remaining bets count")
	public async getRemainingBetsCount(): Promise<string> {
		const count = await this.map.remainingBetsBalanceLabel.innerText();
		return count.toString();
	}

	@step("Get number of bets input")
	public async getNumberOfBetsInput(): Promise<string> {
		const numberOfBetsInput = await this.map.numberOfBetsInput.getAttribute(
			Attributes.VALUE,
		);
		return numberOfBetsInput || "";
	}

	@step("Get user in game balance")
	public async getUserInGameBalance(): Promise<number> {
		const balance = await this.map.userInGameBalance.innerText();
		return parseBalance(balance);
	}

	@step("Place a single bet")
	public async placeSingleBet(): Promise<void> {
		await this.dropBall();
	}

	@step("Press min button")
	public async pressMinButton(): Promise<void> {
		await this.map.minButton.click();
	}

	@step("Press half button")
	public async pressHalfButton(): Promise<void> {
		await this.map.halfButton.click();
	}

	@step("Press max button")
	public async pressMaxButton(): Promise<void> {
		await this.map.maxButton.click();
	}

	@step("Press double button")
	public async pressDoubleButton(): Promise<void> {
		await this.map.doubleButton.click();
	}

	@step("Get bet amount value")
	public async getBetAmountValue(): Promise<string> {
		return this.map.betAmountInput.inputValue();
	}

	@step("Get 'Your Bet' value as number")
	public async getYourBetValue(): Promise<number> {
		return parseBalance(await this.map.yourBetValue.innerText());
	}

	@step("Navigate and wait for game to load")
	public async navigateAndWaitForGameToLoad(): Promise<void> {
		await this.navigate();
		await expect(this.map.dropBallButton).toBeVisible({
			timeout: Timeout.MEDIUM,
		});
	}

	@step("Wait until autobet is finished")
	public async waitUntilAutobetIsFinished(
		initialNumberOfBets: string,
	): Promise<void> {
		await waitUntil(
			async () => {
				const remainingText =
					await this.map.remainingBetsBalanceLabel.textContent();
				return remainingText === initialNumberOfBets;
			},
			{
				errorMessage:
					"Autobet did not finish (remaining bets did not reset)",
				intervalSeconds: TimeoutSeconds.TEN,
				timeoutSeconds: TimeoutSeconds.TWO_FORTY,
			},
		);
	}

	@step("Get profit on win amount from tooltip")
	public async getProfitOnWinAmount(coefficient: Locator): Promise<number> {
		await coefficient.hover();

		const tooltipAmount = this.map.tooltipAmountFor(coefficient);
		const text = await tooltipAmount.innerText();
		const normalizedText = text.replaceAll(",", "");
		return parseFloat(normalizedText);
	}

	@step("Get coefficient value")
	public async getCoefficientValue(coefficient: Locator): Promise<number> {
		const coeffAttr = await coefficient.getAttribute("data-coeff");
		if (!coeffAttr)
			throw new Error(
				"Missing data-coeff attribute on coefficient element",
			);
		return parseFloat(coeffAttr);
	}

	@step("Get bet amount value as number")
	public async getBetAmountNumeric(): Promise<number> {
		const betText = await this.getBetAmountValue();
		return parseFloat(betText);
	}

	@step("Enable instant animation")
	public async enableInstantAnimation(): Promise<void> {
		await this.map.instantAnimationTooltip.click();
	}
}
