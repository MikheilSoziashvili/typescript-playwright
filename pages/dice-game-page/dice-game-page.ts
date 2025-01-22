import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { DiceGamePageMap } from "./dice-game-page-map";
import { DiceGamePageAsserter } from "./dice-game-page-asserter";
import { DiceGamePageSteps } from "./dice-game-page-steps";
import { DICE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { DiceAutobetTestData } from "@dtos/test-data";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";

export class DiceGamePage extends BasePage<DiceGamePageMap> {
	public constructor(page: Page) {
		super(page, new DiceGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [DICE_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): DiceGamePageAsserter {
		return new DiceGamePageAsserter(this);
	}

	public steps(): DiceGamePageSteps {
		return new DiceGamePageSteps(this);
	}

	@step()
	public async fillInManualBetData(
		betAmount: number,
		multiplier?: number,
	): Promise<void> {
		await this.map.manualBetField.fill(`${betAmount}`);
		multiplier !== undefined &&
			(await this.map.manualMultiplierField.fill(`${multiplier}`));
	}

	@step()
	public async rollDice(): Promise<void> {
		await this.map.rollDiceBtn.click();
	}

	@step()
	public async placeBet(betAmount: number, multiplier = 1.1): Promise<void> {
		await this.fillInManualBetData(betAmount, multiplier);
		await this.rollDice();
	}

	@step()
	public async switchToAutobetSection(): Promise<void> {
		await this.map.diceAutobetTabButton.click();
		await this.map.waitForVisibility({
			locator: this.map.autobetContainer,
		});
	}

	@step()
	public async fillIncreaseByInput(
		type: BetIncreaseCondition,
		value: number,
	): Promise<void> {
		switch (type) {
			case BetIncreaseCondition.BOTH:
				await this.map.onWinIncreaseByInput.fill(`${value}`);
				await this.map.onLossIncreaseByInput.fill(`${value}`);
				break;

			case BetIncreaseCondition.WIN:
				await this.map.onWinIncreaseByInput.fill(`${value}`);
				break;

			case BetIncreaseCondition.LOSS:
				await this.map.onLossIncreaseByInput.fill(`${value}`);
				break;
		}
	}

	@step()
	public async fillInAutobetBetData(
		parameters: DiceAutobetTestData,
	): Promise<void> {
		const { betAmount, rollOver, numberOfBets, stopOnProfit, stopOnLoss } =
			parameters;
		await this.map.autobetYourBetInput.fill(betAmount.toString());
		if (rollOver) {
			await this.map.autobetRollOverInput.fill(rollOver.toString());
		}
		if (numberOfBets) {
			await this.map.autobetNbOfBetsInput.fill(numberOfBets.toString());
		}
		if (stopOnProfit) {
			await this.map.autobetStopOnProfitInput.fill(
				stopOnProfit.toString(),
			);
		}
		if (stopOnLoss) {
			await this.map.autobetStopOnLossInput.fill(stopOnLoss.toString());
		}
	}

	@step()
	public async startAutobet(): Promise<void> {
		await this.map.startAutobetButton.click();
	}

	@step()
	public async stopAutobet(): Promise<void> {
		await this.map.stopAutobetButton.click();
	}

	@step()
	public async openLastBetDetails(): Promise<void> {
		await this.map.diceLastResultNumber.click();
	}
}
