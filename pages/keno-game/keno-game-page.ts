import { KENO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { parseBalance } from "@core/utils/utils";
import { BasePage } from "@pages/base/base-page";
import { expect, Page } from "@playwright/test";
import { step } from "decorators/step";
import { KenoGamePageAsserter } from "./keno-game-page-asserter";
import { KenoGamePageMap } from "./keno-game-page-map";
import { KenoGamePageSteps } from "./keno-game-page-steps";
import { Timeout } from "@enums/timeout";
import { KeyboardKey } from "@enums/keyboard";

export class KenoGamePage extends BasePage<KenoGamePageMap> {
	public constructor(page: Page) {
		super(page, new KenoGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [KENO_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): KenoGamePageAsserter {
		return new KenoGamePageAsserter(this);
	}

	public steps(): KenoGamePageSteps {
		return new KenoGamePageSteps(this);
	}

	@step("Navigate and wait for game to load")
	public async navigateAndWaitForGameToLoad(): Promise<void> {
		await this.navigate();
		await expect(this.map.startPlayingButton).toBeVisible({
			timeout: Timeout.LONG,
		});
	}

	@step("Insert bet amount")
	public async fillInBetAmount(betAmount: string | number): Promise<void> {
		await this.map.waitForStableBoundingBox({
			locator: this.map.betAmountInput,
		});
		await this.map.betAmountInput.fill(betAmount.toString());
	}

	@step("Type bet amount")
	public async typeInBetAmount(betAmount: string): Promise<void> {
		await this.map.waitForStableBoundingBox({
			locator: this.map.betAmountInput,
		});
		await this.map.betAmountInput.pressSequentially(betAmount);
	}

	@step("Place a single bet with random tile")
	public async placeSingleBet(): Promise<void> {
		await this.pickRandomTiles();
		await this.map.startPlayingButton.click();
	}

	@step("Press minimum bet button")
	public async pressMinButton(): Promise<void> {
		await this.map.minButton.click();
	}

	@step("Press half bet button")
	public async pressHalfButton(): Promise<void> {
		await this.map.halfButton.click();
	}

	@step("Press maximum bet button")
	public async pressMaxButton(): Promise<void> {
		await this.map.maxButton.click();
	}

	@step("Press double bet button")
	public async pressDoubleButton(): Promise<void> {
		await this.map.doubleButton.click();
	}

	@step("Get bet amount value")
	public async getBetAmountValue(): Promise<string> {
		return this.map.betAmountInput.inputValue();
	}

	@step("Get 'Your Bet' value as number")
	public async getYourBetValue(): Promise<number> {
		return parseBalance(await this.map.yourBetValue.innerText());
	}

	@step("Define slider values")
	public async defineSliderValues(riskValue: number): Promise<void> {
		const sliderThumb = this.map.sliderThumb;
		await sliderThumb.click();
		await sliderThumb.press(KeyboardKey.HOME);

		for (let i = 0; i < riskValue; i++) {
			await sliderThumb.press(KeyboardKey.ARROW_RIGHT);
		}
	}

	@step("Select random Keno tiles")
	public async selectManuallyRandomKenoTiles(
		numberOfTiles = 10,
	): Promise<number[]> {
		const KENO_MAX_TILES = 40;
		const selectedTiles = new Set<number>();

		while (selectedTiles.size < numberOfTiles) {
			const tileNumber = Math.floor(Math.random() * KENO_MAX_TILES) + 1;

			if (!selectedTiles.has(tileNumber)) {
				selectedTiles.add(tileNumber);
				await this.map.kenoGameTile(tileNumber).click();
			}
		}

		return Array.from(selectedTiles);
	}

	@step("Clear selected tiles")
	public async clearSelectedTiles(): Promise<void> {
		if (await this.map.clearTilesButton.isEnabled()) {
			await this.map.clearTilesButton.click();
		}
	}

	@step("Pick random tiles")
	public async pickRandomTiles(): Promise<void> {
		await this.map.pickRandomTilesButton.click();
	}

	@step("Get bet amount input value")
	public async getBetAmountInputValue(): Promise<number> {
		const value = await this.map.betAmountInput.inputValue();
		return parseFloat(value);
	}

	@step("Configure autobet with Increase By")
	public async configureAutobetIncreaseBy(
		betAmount: number,
		riskValue: number,
		autobetCount: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		await this.map.autobetSection.click();
		await this.fillInBetAmount(betAmount);
		await this.defineSliderValues(riskValue);
		await this.map.autobetCount.fill(autobetCount.toString());
		await this.map.increaseByOnWin.fill(onWinPercentage.toString());
		await this.map.increaseByOnLoss.fill(onLossPercentage.toString());
		await this.map.pickRandomTilesButton.click();
	}
}
