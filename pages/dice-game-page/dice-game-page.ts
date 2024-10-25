import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { DiceGamePageMap } from "./dice-game-page-map";
import { DiceGamePageAsserter } from "./dice-game-page-asserter";
import { DiceGamePageSteps } from "./dice-game-page-steps";
import { DICE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { DiceAutobetTestData } from "@dtos/test-data";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";

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
	public async switchToAutobetSection(): Promise<void> {
		await this.map.diceAutobetTabButton.click();
		await this.map.waitForVisibility({
			locator: this.map.autobetContainer,
		});
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

	public async startAutobet(): Promise<void> {
		await this.map.startAutobetButton.click();
	}
}
