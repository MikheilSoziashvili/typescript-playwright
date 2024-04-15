import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { DiceGamePageMap } from "./dice-game-page-map";
import { DiceGamePageAsserter } from "./dice-game-page-asserter";
import { DiceGamePageSteps } from "./dice-game-page-steps";
import { DICE_GAME_PAGE_ENDPOINT } from "../../constants/page-endpoints";

export class DiceGamePage extends BasePage<DiceGamePageMap> {
	public constructor(page: Page) {
		super(page, new DiceGamePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(DICE_GAME_PAGE_ENDPOINT);
	}

	public override assertThat(): DiceGamePageAsserter {
		return new DiceGamePageAsserter(this);
	}

	public steps(): DiceGamePageSteps {
		return new DiceGamePageSteps(this);
	}

	public async fillInBetData(
		betAmount: number,
		multiplier?: number,
	): Promise<void> {
		await this.map.betField.fill(`${betAmount}`);
		multiplier !== undefined &&
			(await this.map.multiplierField.fill(`${multiplier}`));
	}

	public async rollDice(): Promise<void> {
		await this.map.rollDiceBtn.click();
	}
}
