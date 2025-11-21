import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { PocketDiceAsserter } from "./pocket-dice-page-asserter";
import { PocketDiceMap } from "./pocket-dice-page-map";
import { PocketDiceSteps } from "./pocket-dice-page-steps";
import { POCKET_DICE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { KeyboardKey } from "@enums/keyboard";
import { PocketDiceRollType } from "@enums/pocket-dice-enums";

export class PocketDicePage extends BasePage<PocketDiceMap> {
	public constructor(page: Page) {
		super(page, new PocketDiceMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [POCKET_DICE_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): PocketDiceAsserter {
		return new PocketDiceAsserter(this);
	}

	public steps(): PocketDiceSteps {
		return new PocketDiceSteps(this);
	}

	@step("Get bet amount input value")
	public async getBetAmountInputValue(): Promise<number> {
		const value = await this.map.betAmountInput.inputValue();
		return parseFloat(value);
	}

	@step("Define slider values")
	public async defineSliderValues(riskValue: number): Promise<void> {
		const sliderThumb = this.map.numberSlider;
		await sliderThumb.click();
		await sliderThumb.press(KeyboardKey.HOME);

		for (let i = 0; i < riskValue; i++) {
			await sliderThumb.press(KeyboardKey.ARROW_RIGHT);
		}
	}

	@step("Configure autobet with Increase By")
	public async configureAutobetIncreaseBy(
		betAmount: number,
		sliderValue: number,
		rollType: PocketDiceRollType,
		autobetCount: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		await this.map.autobetTab.click();
		await this.map.betAmountInput.fill(betAmount.toString());

		await this.defineSliderValues(sliderValue);

		if (rollType === PocketDiceRollType.UNDER) {
			await this.map.rollUnderButton.click();
		} else {
			await this.map.rollOverButton.click();
		}

		await this.map.autobetsCountInput.fill(autobetCount.toString());
		await this.map.increaseByOnWin.fill(onWinPercentage.toString());
		await this.map.increaseByOnLoss.fill(onLossPercentage.toString());
	}
}
