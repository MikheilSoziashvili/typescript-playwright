import { Page, expect } from "@playwright/test";
import { RouletteGamePageMap } from "./roulette-game-page-map";
import { RouletteGamePageAsserter } from "./roulette-game-page-asserter";
import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { range } from "@core/utils";
import { ROULETTE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePage } from "@base/base-page";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { RouletteGamePageSteps } from "./roulette-game-page-steps";
import { logger } from "@logger/logger";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";

export class RouletteGamePage extends BasePage<RouletteGamePageMap> {
	public constructor(page: Page) {
		super(page, new RouletteGamePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(ROULETTE_GAME_PAGE_ENDPOINT);
		await this.map.waitFor({
			locator: this.map.gameContainer,
			state: VisibilityState.VISIBLE,
		});
	}

	public steps(): RouletteGamePageSteps {
		return new RouletteGamePageSteps(this);
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

	public async betOnColor(betColor: RouletteBetColor): Promise<void> {
		switch (betColor) {
			case RouletteBetColor.GREEN:
				await this.map.betButton(this.map.greenBetSection).click();
				await this.map.waitFor({
					locator: this.map.betSectionsByColor.green,
					state: VisibilityState.VISIBLE,
				});
				break;
			case RouletteBetColor.RED:
				await this.map.betButton(this.map.redBetSection).click();
				await this.map.waitFor({
					locator: this.map.betSectionsByColor.red,
					state: VisibilityState.VISIBLE,
				});
				break;
			case RouletteBetColor.BLACK:
				await this.map.betButton(this.map.blackBetSection).click();
				await this.map.waitFor({
					locator: this.map.betSectionsByColor.black,
					state: VisibilityState.VISIBLE,
				});
				break;
			default:
				break;
		}
	}

	public async placeBet(
		betAmount: number,
		betColor: RouletteBetColor,
	): Promise<void> {
		await this.insertBet(betAmount);
		await this.betOnColor(betColor);
	}

	public calculateProfit(
		betAmount: number,
		betColor: RouletteBetColor,
		includeBetReturn = true,
	): number {
		let result = 0;
		switch (betColor) {
			case RouletteBetColor.GREEN:
				return betAmount * 14;
				break;
			case RouletteBetColor.BLACK:
			case RouletteBetColor.RED:
				return betAmount * 2;
			default:
				break;
		}

		result = !includeBetReturn ? result - betAmount : result;

		return result;
	}

	public calculateGreenHuntAmountByPercentage(
		betAmount: number,
		percentage: number,
	): number {
		return betAmount * (percentage / 100);
	}

	public async expandAutobetSection(): Promise<void> {
		if (await this.map.autobetContainer().isVisible()) {
			logger.info("Autobet section already expanded");
		} else {
			await this.map.autobetButton.click();
			await this.map.waitFor({
				locator: this.map.autobetContainer(),
				state: VisibilityState.VISIBLE,
			});
		}
	}

	public async selectGreenHuntType(type: GreenHuntTypeOption): Promise<void> {
		await this.map.greenHuntTypeDropdown().click();
		if (type === GreenHuntTypeOption.PERCENT) {
			await this.map
				.greenHuntTypeOption(GreenHuntTypeOption.PERCENT)
				.click();
		} else {
			await this.map
				.greenHuntTypeOption(GreenHuntTypeOption.MONEY)
				.click();
		}
	}
}
