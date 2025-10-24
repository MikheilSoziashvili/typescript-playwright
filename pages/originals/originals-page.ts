import { OriginalGames, OriginalGamesPage } from "@core/types/types";
import { HiloBetOption } from "@enums/hilo-bet-options";
import {
	MaxBetAmount,
	MinBetAmount,
	OriginalGame,
	RouletteBetColor,
} from "@enums/original-games";
import {
	PlinkoRiskOption,
	PlinkoRowsOption,
} from "@enums/plinko/plinko-game-options";
import { BasePage } from "@pages/base/base-page";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { step } from "decorators/step";
import { Page } from "playwright";
import { OriginalsAsserter } from "./originals-page-asserter";
import { OriginalsMap } from "./originals-page-map";
import { OriginalsSteps } from "./originals-page-steps";
import { Toast } from "@pages/components/toast/toast";

/**
 * The OriginalsPage class acts as a unified interface for interacting with all the "Originals" games.
 * It leverages individual game POMs (Dice, Crash, Hi-Lo, Roulette).
 */
export class OriginalsPage extends BasePage<OriginalsMap> {
	public readonly toast: Toast;
	public handlers: typeof this._handlers;
	/**
	 * A map that associates each OriginalGame to its corresponding page object.
	 * @type {Record<OriginalGames, OriginalGamesPage>}
	 */
	private gamesMap: Record<OriginalGames, OriginalGamesPage>;

	/**
	 * Constructs an instance of the OriginalsPage.
	 *
	 * @param {Page} page - The Playwright Page object for browser automation.
	 * @param {DiceGamePage} diceGamePage - The Dice game page object.
	 * @param {CrashGamePage} crashGamePage - The Crash game page object.
	 * @param {HiloGamePage} hiloGamePage - The Hi-Lo game page object.
	 * @param {RouletteGamePage} rouletteGamePage - The Roulette game page object.
	 * @param {PlinkoGamePage} plinkoGamePage - The Plinko game page object.
	 * @param {MinesGamePage} minesGamePage - The Mines game page object.
	 * @param {KenoGamesPage} kenoGamePage - The Keno game page object.
	 */
	public constructor(
		page: Page,
		private diceGamePage: DiceGamePage,
		private crashGamePage: CrashGamePage,
		private hiloGamePage: HiloGamePage,
		private rouletteGamePage: RouletteGamePage,
		private plinkoGamePage: PlinkoGamePage,
		private minesGamePage: MinesGamePage,
		private kenoGamePage: KenoGamePage,
	) {
		super(page, new OriginalsMap(page));
		this.gamesMap = {
			Dice: this.diceGamePage,
			Crash: this.crashGamePage,
			Roulette: this.rouletteGamePage,
			HiLo: this.hiloGamePage,
			Plinko: this.plinkoGamePage,
			Mines: this.minesGamePage,
			Keno: this.kenoGamePage,
		};
		this.handlers = this._handlers;
		this.toast = new Toast(this.page);
	}

	/**
	 * Returns an instance of OriginalsAsserter for performing assertions on the Originals page.
	 *
	 * @override
	 * @returns {OriginalsAsserter} - The asserter instance specific to the Originals page.
	 */
	public override assertThat(): OriginalsAsserter {
		return new OriginalsAsserter(this);
	}

	/**
	 * Returns an instance of OriginalsSteps for performing higher-level interactions on the Originals page.
	 *
	 * @returns {OriginalsSteps} - The steps instance for the Originals page.
	 */
	public steps(): OriginalsSteps {
		return new OriginalsSteps(this);
	}

	/**
	 * Navigates to a specified Originals game using its dedicated page object.
	 *
	 * @param {OriginalGames} game - The name of the game to navigate to (e.g., "Dice", "Crash", "Roulette", "Hi-Lo").
	 * @returns {Promise<void>} A promise that resolves when navigation is complete.
	 */
	@step("Navigate to game")
	public async navigateToGame(game: OriginalGames): Promise<void> {
		const gamePage = this.gamesMap[game];
		await gamePage.navigate();
	}

	/**
	 * Places a bet on a specified Originals game.
	 *
	 * Depending on the game, the `multiplierOrColorOrOption` parameter may represent:
	 * - For "Crash": the autoCashoutMultiplier (number)
	 * - For "Dice": the multiplier (number)
	 * - For "Roulette": the bet color (RouletteBetColor)
	 * - For "Hi-Lo": the bet option (HiloBetOption)
	 * - For "Plinko": an object with rowsValue and riskValue options
	 * - For "Mines": the number of mines (number)
	 *
	 * If no suitable parameter is provided, a default value or option is used.
	 *
	 * @param {OriginalGames} game - The game to place a bet on.
	 * @param {number} betAmount - The amount of the bet.
	 * @param {number | RouletteBetColor | HiloBetOption | { rowsValue?: PlinkoRowsOption, riskValue?: PlinkoRiskOption } | number} [multiplierOrColorOrOption] - An optional parameter that can represent multiplier, color, betting option, Plinko options, or number of mines, depending on the game.
	 * @returns {Promise<void>} A promise that resolves when the bet has been placed.
	 */
	@step("Place bet")
	public async placeBet(
		game: OriginalGames,
		betAmount: number,
		multiplierOrColorOrOption?:
			| number
			| RouletteBetColor
			| HiloBetOption
			| { rowsValue?: PlinkoRowsOption; riskValue?: PlinkoRiskOption },
	): Promise<void> {
		const gamePage = this.gamesMap[game];
		const isNumber = typeof multiplierOrColorOrOption === "number";
		const isString = typeof multiplierOrColorOrOption === "string";
		const isObject = typeof multiplierOrColorOrOption === "object";
		const defaultMultiplier = 1.1;

		switch (game) {
			case OriginalGame.Crash: {
				const crashMultiplier = isNumber
					? multiplierOrColorOrOption
					: defaultMultiplier;
				await (gamePage as CrashGamePage).placeBet(
					betAmount,
					crashMultiplier,
				);
				break;
			}
			case OriginalGame.Dice: {
				const diceMultiplier = isNumber
					? multiplierOrColorOrOption
					: defaultMultiplier;
				await (gamePage as DiceGamePage).placeBet(
					betAmount,
					diceMultiplier,
				);
				break;
			}
			case OriginalGame.Roulette: {
				const betColor = isString
					? (multiplierOrColorOrOption as RouletteBetColor)
					: RouletteBetColor.RED;
				await (gamePage as RouletteGamePage).placeBet(
					betAmount,
					betColor,
				);
				break;
			}
			case OriginalGame.HiLo: {
				const betOption = isString
					? (multiplierOrColorOrOption as HiloBetOption)
					: HiloBetOption.RED;
				await (gamePage as HiloGamePage).placeBet(betAmount, betOption);
				break;
			}
			case OriginalGame.Plinko: {
				const plinkoOptions = isObject
					? (multiplierOrColorOrOption as {
							rowsValue?: PlinkoRowsOption;
							riskValue?: PlinkoRiskOption;
					  })
					: {};
				await (gamePage as PlinkoGamePage).startManualBet(
					betAmount.toString(),
					plinkoOptions,
				);
				break;
			}
			case OriginalGame.Mines: {
				await (gamePage as MinesGamePage)
					.assertThat()
					.startPlayingButtonIsDisplayed();
				await (gamePage as MinesGamePage)
					.steps()
					.placeManualBetWithRandomTile({
						betAmount: betAmount,
						minesNumber: isNumber ? multiplierOrColorOrOption : 1,
						cashoutMultiplier: 0,
					});
				break;
			}
			case OriginalGame.Keno: {
				await (gamePage as KenoGamePage)
					.assertThat()
					.startPlayingButtonIsDisplayed();
				await (gamePage as KenoGamePage)
					.steps()
					.startManualBet(betAmount);
				break;
			}
			default: {
				throw new Error(`Unhandled game type: ${String(game)}`);
			}
		}
	}

	/**
	 * Waits for the current game round to finish.
	 *
	 * For each game, this method performs the appropriate wait actions:
	 * - For "Crash": Waits for the previous bet round to finish and for the betting window to become available
	 * - For "Dice": Waits for the dice result to be displayed
	 * - For "Roulette": Waits for the betting window to become available and for the round result number
	 * - For "Hi-Lo": Waits for the betting window to become available and for the round result
	 * - For "Plinko": Waits for the sliders to become active again, indicating the round is complete
	 * - For "Mines": Waits for either a bomb to be revealed or all safe tiles to be revealed
	 *
	 * @param {OriginalGames} game - The game to wait for.
	 * @returns {Promise<void>} A promise that resolves when the game round has finished.
	 */
	@step("Wait for game round finish")
	public async waitForGameRoundFinish(game: OriginalGames): Promise<void> {
		const gamePage = this.gamesMap[game];

		switch (game) {
			case OriginalGame.Crash: {
				await (gamePage as CrashGamePage).waitPreviousBetRoundFinish();
				await (gamePage as CrashGamePage).waitBettingWindowAvailable();
				break;
			}
			case OriginalGame.Dice: {
				await (gamePage as DiceGamePage)
					.assertThat()
					.diceResultIsDisplayed();
				break;
			}
			case OriginalGame.Roulette: {
				await (
					gamePage as RouletteGamePage
				).waitBettingWindowAvailable();
				await (gamePage as RouletteGamePage).waitRoundResultNumber();
				break;
			}
			case OriginalGame.HiLo: {
				await (gamePage as HiloGamePage).waitBettingWindowAvailable();
				await (gamePage as HiloGamePage).waitRoundResult();
				break;
			}
			case OriginalGame.Plinko: {
				await (gamePage as PlinkoGamePage)
					.steps()
					.waitForSlidersToBeActive();
				break;
			}
			case OriginalGame.Keno: {
				await (gamePage as KenoGamePage)
					.assertThat()
					.verifyRiskSliderActive();
				break;
			}
			case OriginalGame.Mines: {
				const isCashoutAvailable = await (
					gamePage as MinesGamePage
				).map.manualCashoutButton.isVisible();

				if (isCashoutAvailable) {
					await (gamePage as MinesGamePage)
						.steps()
						.performManualCashout();
				}
				await (gamePage as MinesGamePage)
					.assertThat()
					.startPlayingButtonIsDisplayed();
				await (gamePage as MinesGamePage)
					.assertThat()
					.pickRandomTileButtonIsNotDisplayed();
				break;
			}
			default: {
				throw new Error(`Unhandled game type: ${String(game)}`);
			}
		}
	}

	private readonly _handlers: Partial<
		Record<
			OriginalGame,
			{
				setBetAmount?: (amount: number) => Promise<void>;
				pressMinButton?: () => Promise<void>;
				pressHalfButton?: () => Promise<void>;
				pressMaxButton?: () => Promise<void>;
				pressDoubleButton?: () => Promise<void>;
				getBetAmountValue?: () => Promise<string>;
			}
		>
	> = {
		[OriginalGame.Plinko]: {
			setBetAmount: (amount) =>
				this.plinkoGamePage.fillInBetAmount(amount),
			pressMinButton: () => this.plinkoGamePage.pressMinButton(),
			pressHalfButton: () => this.plinkoGamePage.pressHalfButton(),
			pressMaxButton: () => this.plinkoGamePage.pressMaxButton(),
			pressDoubleButton: () => this.plinkoGamePage.pressDoubleButton(),
			getBetAmountValue: () => this.plinkoGamePage.getBetAmountValue(),
		},
		[OriginalGame.Mines]: {
			setBetAmount: (amount) => this.minesGamePage.insertBet(amount),
			pressMinButton: () => this.minesGamePage.pressMinButton(),
			pressHalfButton: () => this.minesGamePage.pressHalfButton(),
			pressMaxButton: () => this.minesGamePage.pressMaxButton(),
			pressDoubleButton: () => this.minesGamePage.pressDoubleButton(),
			getBetAmountValue: () => this.minesGamePage.getBetAmountValue(),
		},
		[OriginalGame.Keno]: {
			setBetAmount: (amount) => this.kenoGamePage.insertBet(amount),
			pressMinButton: () => this.kenoGamePage.pressMinButton(),
			pressHalfButton: () => this.kenoGamePage.pressHalfButton(),
			pressMaxButton: () => this.kenoGamePage.pressMaxButton(),
			pressDoubleButton: () => this.kenoGamePage.pressDoubleButton(),
			getBetAmountValue: () => this.kenoGamePage.getBetAmountValue(),
		},
	};

	public getMinBetAmount(game: OriginalGame): number {
		return MinBetAmount[game.toUpperCase() as keyof typeof MinBetAmount];
	}

	public getMaxBetAmount(game: OriginalGame): number {
		return MaxBetAmount[game.toUpperCase() as keyof typeof MaxBetAmount];
	}

	@step("Get 'Your Bet' value for game")
	public async getYourBetValueForGame(game: OriginalGame): Promise<number> {
		const gamePage = this.gamesMap[game];
		switch (game) {
			case OriginalGame.Plinko:
				return (gamePage as PlinkoGamePage).getYourBetValue();
			case OriginalGame.Keno:
				return (gamePage as KenoGamePage).getYourBetValue();
			case OriginalGame.Mines:
				return (gamePage as MinesGamePage).getYourBetValue();
			default:
				throw new Error(
					`Get your bet value method not implemented for ${game}`,
				);
		}
	}

	@step("Open How to Play modal")
	public async openHowToPlayModal(): Promise<void> {
		await this.map.howToPlayTooltip.click();
	}

	@step("Click How to Play modal Next button")
	public async clickHowToPlayModalNextButton(): Promise<void> {
		await this.map.howToPlayModalNextButton.click();
	}

	@step("Verify self-exclusion message is displayed")
	public async verifySelfExclusionMessageIsDisplayed(
		game: OriginalGames,
		betAmount: number,
	): Promise<void> {
		const toastGames = [
			OriginalGame.Dice,
			OriginalGame.Roulette,
			OriginalGame.HiLo,
			OriginalGame.Crash,
		];

		if (toastGames.includes(game)) {
			await this.placeBet(game, betAmount);
			await this.assertThat().selfExclusionToastMessageIsDisplayed();
		} else {
			await this.assertThat().selfExclusionPageTextIsDisplayed();
		}
	}
}
