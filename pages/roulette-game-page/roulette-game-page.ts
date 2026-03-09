import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { RouletteGamePageMap } from "./roulette-game-page-map";
import { RouletteGamePageAsserter } from "./roulette-game-page-asserter";
import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { ROULETTE_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePage } from "@base/base-page";
import { RouletteGamePageSteps } from "./roulette-game-page-steps";
import { logger } from "@logger/logger";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Timeout } from "@enums/timeout";
import { KeyboardKey } from "@enums/keyboard";
import { digitsOnlyPattern } from "@support/regex-patterns";
import { VisibilityState } from "@enums/playwright/visibility-states";

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

	@step("Wait for betting window to be available")
	public async waitBettingWindowAvailable(): Promise<void> {
		const timeLeft = await this.getTimeLeftForBetting();

		if (timeLeft < 5) {
			logger.info(
				`Time left for betting is ${timeLeft} seconds. Waiting for the next round...`,
			);

			await this.map.waitForInvisibility({
				locator: this.map.acceptingBetsState,
				timeout: Timeout.LONG,
			});

			await this.map.waitForVisibility({
				locator: this.map.acceptingBetsState,
				timeout: Timeout.LONG,
			});

			logger.info("Betting window is now available.");
		} else {
			logger.info(
				`Sufficient time left (${timeLeft} seconds) to place the bet.`,
			);
		}
	}

	@step("Get round result number")
	public async getRoundResultNumber(): Promise<string> {
		await this.map.gameResultStateLocator.waitFor({
			state: VisibilityState.VISIBLE,
			timeout: Timeout.LONG,
		});
		const text = await this.map.roundResultNumber.innerText();
		return text.match(digitsOnlyPattern)?.[0] ?? "";
	}

	public getColorFromResultNumber(
		roundResultNum: number,
	): RouletteNumberColor {
		if (roundResultNum === RouletteNumberColor.GREEN.valueOf()) {
			return RouletteNumberColor.GREEN;
		} else if (roundResultNum >= 1 && roundResultNum <= 50) {
			return RouletteNumberColor.RED;
		} else if (roundResultNum >= 51 && roundResultNum <= 100) {
			return RouletteNumberColor.BLACK;
		} else {
			throw new Error(`Unknown round result number: ${roundResultNum}`);
		}
	}

	@step("Insert bet")
	public async insertBet(betAmount: number): Promise<void> {
		await this.map.betField.click();
		await this.map.betField.selectText();
		await this.map.betField.press(KeyboardKey.BACKSPACE);
		await this.map.betField.pressSequentially(String(betAmount));
	}

	@step("Bet on color")
	public async betOnColor(betColor: RouletteBetColor): Promise<void> {
		await this.map.betSectionsByColor[betColor].click();
	}

	@step("Expand autobet section")
	public async expandAutobetSection(): Promise<void> {
		await this.map.autobetContainer().click();
	}

	@step("Select green hunt type")
	public async selectGreenHuntType(type: GreenHuntTypeOption): Promise<void> {
		await this.map.greenHuntTypeDropdown().click();
		await this.map.greenHuntTypeOption(type).click();
	}

	@step("Get time left for betting")
	public async getTimeLeftForBetting(): Promise<number> {
		if (!(await this.map.acceptingBetsState.isVisible())) {
			await this.map.waitForVisibility({
				locator: this.map.acceptingBetsState,
				timeout: Timeout.LONG,
			});
		}

		const timeText = await this.map.spinningCountdownCounter.innerText({
			timeout: Timeout.LONG,
		});
		return parseInt(timeText);
	}
}
