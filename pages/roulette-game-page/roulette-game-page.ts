import { Page, expect } from "@playwright/test";
import { RouletteGamePageMap } from "./roulette-game-page-map";
import { RouletteGamePageAsserter } from "./roulette-game-page-asserter";
import { RouletteNumberColor } from "@enums/original-games";
import { range } from "@core/utils";
import { ROULETTE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePage } from "@base/base-page";
import { VisibilityStates } from "@enums/playwright/visibility-states";

export class RouletteGamePage extends BasePage<RouletteGamePageMap> {
	public constructor(page: Page) {
		super(page, new RouletteGamePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(ROULETTE_GAME_PAGE_ENDPOINT);
		await this.map.gameContainer.waitFor({
			state: VisibilityStates.VISIBLE,
		});
	}

	public override assertThat(): RouletteGamePageAsserter {
		return new RouletteGamePageAsserter(this);
	}

	public async waitBettingWindowAvailable(timeout = 30): Promise<void> {
		await expect(this.map.spinningCountdownCounter).toBeAttached({
			timeout: timeout * 1000,
		});
	}

	public async waitRoundResultNumber(timeout = 30): Promise<void> {
		await expect(this.map.roundResultNumber).toBeVisible({
			timeout: timeout * 1000,
		});
	}

	public async getRoundResultNumber(waitTimeout = 30): Promise<string> {
		await this.waitRoundResultNumber(waitTimeout);
		return this.map.roundResultNumber.innerText();
	}

	public async getRoundResultColor(
		waitTimeout = 30,
	): Promise<RouletteNumberColor> {
		const roundResultNum = Number(
			await this.getRoundResultNumber(waitTimeout),
		);
		if (roundResultNum == RouletteNumberColor.GREEN.valueOf()) {
			return RouletteNumberColor.GREEN;
		} else if (
			range(
				RouletteNumberColor.GREEN + 1,
				RouletteNumberColor.RED + 1,
			).includes(roundResultNum)
		) {
			return RouletteNumberColor.RED;
		} else if (
			range(
				RouletteNumberColor.RED + 1,
				RouletteNumberColor.BLACK + 1,
			).includes(roundResultNum)
		) {
			return RouletteNumberColor.BLACK;
		} else {
			throw new Error(`Unknown round result number: ${roundResultNum}`);
		}
	}

	public async insertBet(betAmount: number): Promise<void> {
		await this.map.betField.fill(`${betAmount}`);
	}

	public async betOnColor(
		rouletteNumberColor: RouletteNumberColor,
	): Promise<void> {
		switch (rouletteNumberColor) {
			case RouletteNumberColor.GREEN:
				await this.map.betButton(this.map.greenBetSection).click();
				break;
			case RouletteNumberColor.RED:
				await this.map.betButton(this.map.redBetSection).click();
				break;
			case RouletteNumberColor.BLACK:
				await this.map.betButton(this.map.blackBetSection).click();
				break;
			default:
				break;
		}
	}

	public async placeBet(
		betAmount: number,
		rouletteNumberColor: RouletteNumberColor,
	): Promise<void> {
		await this.insertBet(betAmount);
		await this.betOnColor(rouletteNumberColor);
	}

	public calculateProfit(
		betAmount: number,
		rouletteNumberColor: RouletteNumberColor,
		includeBetReturn = true,
	): number {
		let result = 0;
		switch (rouletteNumberColor) {
			case RouletteNumberColor.GREEN:
				return betAmount * 14;
				break;
			case RouletteNumberColor.BLACK:
			case RouletteNumberColor.RED:
				return betAmount * 2;
			default:
				break;
		}

		result = !includeBetReturn ? result - betAmount : result;

		return result;
	}
}
