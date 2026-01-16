import { Page } from "@playwright/test";
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
			locator: this.map.gameArea,
		});
	}

	public override assertThat(): HiloGamePageAsserter {
		return new HiloGamePageAsserter(this);
	}

	public steps(): HiloGamePageSteps {
		return new HiloGamePageSteps(this);
	}

	@step("Fill in bet amount")
	public async fillInBetAmount(betAmount: number): Promise<void> {
		await this.map.yourBetField.fill(`${betAmount}`);
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
			default:
				break;
		}
	}

	@step("Wait betting window available")
	public async waitBettingWindowAvailable(
		timeout = Timeout.EXTRA_MAX / 2,
	): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.spinningCountdownTimer,
			timeout: timeout,
		});
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

	@step("Wait round result")
	public async waitRoundResult(): Promise<void> {
		await this.map.waitFor({
			locator: this.map.spinningCountdownTimer,
			state: VisibilityState.HIDDEN,
			timeout: Timeout.MEDIUM,
		});
		await this.map.waitForVisibility({
			locator: this.map.gamRoundResultLocator,
		});
	}

	@step("Get round result")
	public async getRoundResult(): Promise<string> {
		await this.waitRoundResult();

		return (await this.map.gamRoundResultLocator.textContent()) || "";
	}

	public calculateProfit(
		betAmount: number,
		hiloBetOptions: HiloBetMultiplierByBetOption,
		includeBetReturn = true,
	): number {
		let result = 0;
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
				break;
		}

		result = !includeBetReturn ? result - betAmount : result;

		return result;
	}

	@step("Wait betting window available - v4")
	public async waitBettingWindowAvailableV4(
		timeout = Timeout.EXTRA_MAX / 2,
	): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.spinningCountdownTimerV4,
			timeout: timeout,
		});
	}

	@step("Fill in bet amount - v4")
	public async fillInBetAmountV4(betAmount: number): Promise<void> {
		await this.map.yourBetFieldV4.fill(`${betAmount}`);
	}

	@step("Click bet option - v4")
	public async clickBetOptionV4(betOption: HiloBetOption): Promise<void> {
		switch (betOption) {
			case HiloBetOption.RED:
				await this.map.redButtonV4.click();
				break;
			case HiloBetOption.BLACK:
				await this.map.blackButtonV4.click();
				break;
			default:
				break;
		}
	}

	@step("Place bet - v4")
	public async placeBetV4(
		betAmount: number,
		betOption: HiloBetOption,
	): Promise<void> {
		await this.waitBettingWindowAvailableV4();
		await this.fillInBetAmountV4(betAmount);
		await this.clickBetOptionV4(betOption);
	}
}
