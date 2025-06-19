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

	@step()
	public async openLoginModal(): Promise<void> {
		await this.map.signInButton.click();
	}

	@step()
	public async clickAutobet(): Promise<void> {
		await this.map.autoBetButton.click();
	}

	@step()
	public async fillInBetAmount(betAmount: string | number): Promise<void> {
		await this.map.betAmountInput.fill(betAmount.toString());
	}

	@step()
	public async dropBall(): Promise<void> {
		await this.map.dropBallButton.click();
	}

	@step()
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

	@step()
	public async getRowsSliderValue(): Promise<number> {
		return this.getSliderValue(this.map.betRowsSliderContainer);
	}

	@step()
	public async getRiskSliderValue(): Promise<number> {
		return this.getSliderValue(this.map.riskRowsSliderContainer);
	}

	@step()
	public async getRemainingBetsCount(): Promise<string> {
		const count = await this.map.remainingBetsBalanceLabel.innerText();
		return count.toString();
	}

	@step()
	public async getNumberOfBetsInput(): Promise<string> {
		const numberOfBetsInput = await this.map.numberOfBetsInput.getAttribute(
			Attributes.VALUE,
		);
		return numberOfBetsInput || "";
	}

	@step()
	public async getUserInGameBalance(): Promise<number> {
		const balance = await this.map.userInGameBalance.innerText();
		return parseBalance(balance);
	}
}
