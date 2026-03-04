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
import { Toast } from "@pages/components/toast/toast";
import { KeyboardKey } from "@enums/keyboard";

export class DiceGamePage extends BasePage<DiceGamePageMap> {
	public toast: Toast;
	public constructor(page: Page) {
		super(page, new DiceGamePageMap(page));
		this.toast = new Toast(page);
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

	@step("Switch to autobet section")
	public async switchToAutobetSection(): Promise<void> {
		await this.map.diceAutobetTabButton.click();
	}

	public async getBetAmountInputValue(): Promise<number> {
		return parseFloat(await this.map.autobetYourBetInput.inputValue());
	}

	@step("Configure autobet with Increase By")
	public async configureAutobetIncreaseBy(
		betAmount: number,
		numberOfBets: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		await this.switchToAutobetSection();
		await this.map.autobetYourBetInput.fill(betAmount.toString());
		await this.map.autobetNbOfBetsInput.fill(numberOfBets.toString());
		await this.fillIncreaseByInput(
			BetIncreaseCondition.WIN,
			onWinPercentage,
		);
		await this.fillIncreaseByInput(
			BetIncreaseCondition.LOSS,
			onLossPercentage,
		);
	}

	@step("Fill increase by input")
	public async fillIncreaseByInput(
		type: BetIncreaseCondition,
		value: number,
	): Promise<void> {
		await this.map.getIncreaseBySelectButton(type).click();
		await this.map.getIncreaseByOption(type).click();
		const input = this.map.getIncreaseByPercentInput(type);
		await input.click();
		await input.selectText();
		await input.press(KeyboardKey.BACKSPACE);
		await input.pressSequentially(`${value}`);
	}

	@step("Fill in autobet bet data")
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

	@step("Start autobet")
	public async startAutobet(): Promise<void> {
		await this.map.startAutobetButton.click();
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.map.stopAutobetButton.click();
	}

	@step("Open last bet details")
	public async openLastBetDetails(): Promise<void> {
		await this.map.diceLastResultNumber.click();
	}

	@step("Open dice history")
	public async openDiceHistory(): Promise<void> {
		await this.map.diceRollHistoryButton.click();
	}

	@step("Roll dice with amount")
	public async rollDiceWithAmount(amount: number): Promise<void> {
		await this.fillInManualBetData(amount);
		await this.rollDice();
	}

	@step("Check if auto bet input field is disabled")
	public async isAutoBetInputFieldDisabled(): Promise<boolean> {
		return this.map.autobetYourBetInput.isDisabled();
	}

	@step("Fill in manual bet data")
	public async fillInManualBetData(
		betAmount: number,
		multiplier?: number,
	): Promise<void> {
		await this.map.manualBetField.fill(`${betAmount}`);
		if (multiplier !== undefined) {
			await this.map.manualMultiplierField.fill(`${multiplier}`);
		}
	}

	@step("Roll dice")
	public async rollDice(): Promise<void> {
		await this.map.rollDiceBtn.click();
	}

	@step("Place bet")
	public async placeBet(betAmount: number, multiplier = 1.1): Promise<void> {
		await this.fillInManualBetData(betAmount, multiplier);
		await this.rollDice();
	}

	@step("Check if manual bet input field is disabled")
	public async isManualBetInputFieldDisabled(): Promise<boolean> {
		return this.map.manualBetField.isDisabled();
	}

	@step("Open Fairness tab")
	public async openFairnessTab(): Promise<void> {
		await this.map.gameDescriptionToggleButton.click();
		await this.map.fairnessButton.click();
	}
}
