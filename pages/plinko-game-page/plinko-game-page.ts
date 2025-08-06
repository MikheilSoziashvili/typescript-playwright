import { BasePage } from "@base/base-page";
import { PLINKO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { parseBalance } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { PlinkoGamePageAsserter } from "./plinko-game-page-asserter";
import { PlinkoGamePageMap } from "./plinko-game-page-map";
import { PlinkoGamePageSteps } from "./plinko-game-page-steps";

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
		await this.map.betAmountInput.fill(betAmount.toString());
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
}
