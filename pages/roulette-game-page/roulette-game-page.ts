import { Page, expect } from "@playwright/test";
import { step } from "decorators/step";
import { RouletteGamePageMap } from "./roulette-game-page-map";
import { RouletteGamePageAsserter } from "./roulette-game-page-asserter";
import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { range } from "@core/utils/utils";
import { ROULETTE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePage } from "@base/base-page";
import { RouletteGamePageSteps } from "./roulette-game-page-steps";
import { logger } from "@logger/logger";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Timeout } from "@enums/timeout";

export class RouletteGamePage extends BasePage<RouletteGamePageMap> {
	public constructor(page: Page) {
		super(page, new RouletteGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [ROULETTE_GAME_PAGE_ENDPOINT] },
		});
		await this.map.waitForVisibility({
			locator: this.map.gameContainer,
		});
	}

	public steps(): RouletteGamePageSteps {
		return new RouletteGamePageSteps(this);
	}

	public override assertThat(): RouletteGamePageAsserter {
		return new RouletteGamePageAsserter(this);
	}

	// Wait for the next betting window if the current round is finishing,
	// as we don't know the game's state when the test starts.
	@step("Wait for betting window to be available")
	public async waitBettingWindowAvailable(): Promise<void> {
		const timeLeft = await this.getTimeLeftForBetting();

		if (timeLeft < 4) {
			logger.info(
				`Time left for betting is ${timeLeft} seconds. Waiting for the next round...`,
			);

			await this.map.waitForInvisibility({
				locator: this.map.spinningCountdownCounter,
				timeout: Timeout.LONG,
			});

			await this.map.waitForVisibility({
				locator: this.map.spinningCountdownCounter,
				timeout: Timeout.LONG,
			});

			logger.info("Betting window is now available.");
		} else {
			logger.info(
				`Sufficient time left (${timeLeft} seconds) to place the bet.`,
			);
		}
	}

	@step("Wait for round result number")
	public async waitRoundResultNumber(timeout = 30): Promise<void> {
		await expect(this.map.roundResultNumber).toBeVisible({
			timeout: timeout * 1000,
		});
	}

	@step("Get round result number")
	public async getRoundResultNumber(waitTimeout = 30): Promise<string> {
		await this.waitRoundResultNumber(waitTimeout);
		return this.map.roundResultNumber.innerText();
	}

	@step("Get number of bet rows")
	public async getNumberOfBetRows(
		betColor: RouletteBetColor,
	): Promise<number> {
		const betRows = this.map.betRowsByColor(betColor);
		logger.info(
			`Number of bet rows for color ${betColor}: ${await betRows.count()}`,
		);
		return betRows.count();
	}

	@step("Get total bets count")
	public async getTotalBetsCount(
		betColor: RouletteBetColor,
	): Promise<number> {
		const betSection = this.map.betSectionsByColor[betColor];
		const countText = await this.map
			.betTotalBetsCount(betSection)
			.innerText();

		logger.info(`Total bets count for color ${betColor}: ${countText}`);
		return parseInt(countText, 10);
	}

	@step("Get round result color")
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

	@step("Insert bet")
	public async insertBet(betAmount: number): Promise<void> {
		await this.map.betField.fill(`${betAmount}`);
	}

	@step("Bet on color")
	public async betOnColor(betColor: RouletteBetColor): Promise<void> {
		switch (betColor) {
			case RouletteBetColor.GREEN:
				await this.map.betButton(this.map.greenBetSection).click();
				await this.map.waitForVisibility({
					locator: this.map.betSectionsByColor.green,
				});
				break;
			case RouletteBetColor.RED:
				await this.map.betButton(this.map.redBetSection).click();
				await this.map.waitForVisibility({
					locator: this.map.betSectionsByColor.red,
				});
				break;
			case RouletteBetColor.BLACK:
				await this.map.betButton(this.map.blackBetSection).click();
				await this.map.waitForVisibility({
					locator: this.map.betSectionsByColor.black,
				});
				break;
			default:
				break;
		}
	}

	@step("Place bet")
	public async placeBet(
		betAmount: number,
		betColor: RouletteBetColor,
	): Promise<void> {
		await this.waitBettingWindowAvailable();
		await this.insertBet(betAmount);
		await this.assertThat().betButtonsEnabled();
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

	@step("Expand autobet section")
	public async expandAutobetSection(): Promise<void> {
		if (await this.map.autobetContainer().isVisible()) {
			logger.info("Autobet section already expanded");
		} else {
			await this.map.autobetButton.click();
			await this.map.waitForVisibility({
				locator: this.map.autobetContainer(),
			});
		}
	}

	@step("Select green hunt type")
	public async selectGreenHuntType(type: GreenHuntTypeOption): Promise<void> {
		await this.map.greenHuntTypeDropdown().click();
		const option =
			type === GreenHuntTypeOption.PERCENT
				? GreenHuntTypeOption.PERCENT
				: GreenHuntTypeOption.MONEY;

		await this.map.greenHuntTypeOption(option).click();
	}

	// Get the time left for betting, ensuring the game has finished spinning,
	// by waiting for hidden and visible states since the roulette's state at test start is unknown.
	@step("Get time left for betting")
	public async getTimeLeftForBetting(): Promise<number> {
		const isSpinning = await this.map.gameResultStateLocator.isVisible();

		if (isSpinning) {
			await this.map.waitForInvisibility({
				locator: this.map.gameResultStateLocator,
				timeout: Timeout.LONG,
			});

			await this.map.waitForVisibility({
				locator: this.map.spinningCountdownCounter,
				timeout: Timeout.LONG,
			});
		}

		const timeText = await this.map.spinningCountdownCounter.innerText({
			timeout: Timeout.LONG,
		});
		return parseInt(timeText);
	}
}
