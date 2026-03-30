import { Locator, Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { HiloGamePageMap } from "./hilo-game-page.map";
import { HiloGamePageAsserter } from "./hilo-game-page-asserter";
import { HILO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { HiloGamePageSteps } from "./hilo-game-page-steps";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { logger } from "@logger/logger";

export class HiloGamePage extends BasePage<HiloGamePageMap> {
	public constructor(page: Page) {
		super(page, new HiloGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [HILO_GAME_PAGE_ENDPOINT] },
		});
		await this.map.waitForVisibility({
			locator: this.map.gameContainer,
		});
	}

	public override assertThat(): HiloGamePageAsserter {
		return new HiloGamePageAsserter(this);
	}

	public steps(): HiloGamePageSteps {
		return new HiloGamePageSteps(this);
	}

	@step("Get time left for betting")
	public async getTimeLeftForBetting(): Promise<number> {
		if (!(await this.map.spinningCountdownTimer.isVisible())) {
			await this.map.waitForVisibility({
				locator: this.map.spinningCountdownTimer,
				timeout: Timeout.LONG,
			});
		}
		const statusText = await this.map.spinningCountdownStatus.innerText({
			timeout: Timeout.LONG,
		});
		return parseFloat(statusText);
	}

	@step("Wait for betting window to be available")
	public async waitBettingWindowAvailable(): Promise<void> {
		const timeLeft = await this.getTimeLeftForBetting();

		if (timeLeft < 2) {
			logger.info(
				`Time left for betting is ${timeLeft} seconds. Waiting for the next round...`,
			);

			await this.map.waitForInvisibility({
				locator: this.map.spinningCountdownTimer,
				timeout: Timeout.LONG,
			});

			await this.map.waitForVisibility({
				locator: this.map.spinningCountdownTimer,
				timeout: Timeout.LONG,
			});
		} else {
			logger.info(
				`Sufficient time left (${timeLeft} seconds) to place the bet.`,
			);
		}
	}

	@step("Fill in bet amount")
	public async fillInBetAmount(betAmount: number): Promise<void> {
		await this.map.yourBetField.fill(`${betAmount}`);
	}

	public getAlwaysEnabledBetButtons(): Locator[] {
		return [
			this.map.redButton,
			this.map.blackButton,
			this.map.twoToNineButton,
			this.map.jqkaButton,
			this.map.kaButton,
			this.map.aceButton,
			this.map.jokerButton,
		];
	}

	@step("Click bet option")
	public async clickBetOption(betOption: HiloBetOption): Promise<void> {
		switch (betOption) {
			case HiloBetOption.RED:
				await this.map.redButton.click();
				break;
			case HiloBetOption.BLACK:
				await this.map.blackButton.click();
				break;
			case HiloBetOption.JOKER:
				await this.map.jokerButton.click();
				break;
		}
	}

	@step("Place bet")
	public async placeBet(
		betAmount: number,
		betOption: HiloBetOption,
	): Promise<void> {
		await this.waitBettingWindowAvailable();
		await this.fillInBetAmount(betAmount);
		await this.clickBetOption(betOption);
	}

	@step("Get current history card count")
	public async getHistoryCardCount(): Promise<number> {
		return this.map.historyCards.count();
	}

	@step("Wait round result")
	public async waitRoundResult(): Promise<void> {
		await this.map.gameResultLocator.waitFor({
			state: VisibilityState.VISIBLE,
			timeout: Timeout.LONG,
		});
	}

	@step("Get round result")
	public async getRoundResult(): Promise<string> {
		await this.waitRoundResult();
		const result = await this.map.gameResultLocator.innerText({
			timeout: Timeout.LONG,
		});
		await this.map.gameResultLocator.waitFor({
			state: VisibilityState.HIDDEN,
			timeout: Timeout.LONG,
		});
		return result;
	}

	public calculateProfit(
		betAmount: number,
		hiloBetOptions: HiloBetMultiplierByBetOption,
	): number {
		switch (hiloBetOptions) {
			case HiloBetMultiplierByBetOption.JOKER:
				return betAmount * 24;
			case HiloBetMultiplierByBetOption.ACE:
				return betAmount * 12;
			case HiloBetMultiplierByBetOption.BIG_SYMBOL:
				return betAmount * 6;
			case HiloBetMultiplierByBetOption.SYMBOL:
				return betAmount * 3;
			case HiloBetMultiplierByBetOption.BLACK:
			case HiloBetMultiplierByBetOption.RED:
				return betAmount * 2;
			default:
				throw new Error("Unknown bet option");
		}
	}
}
