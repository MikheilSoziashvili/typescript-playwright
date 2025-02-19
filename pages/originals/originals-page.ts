import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { OriginalsAsserter } from "./originals-page-asserter";
import { OriginalsMap } from "./originals-page-map";
import { OriginalsSteps } from "./originals-page-steps";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { OriginalGamesPage, OriginalGames } from "@core/types/types";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { step } from "decorators/step";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";

/**
 * The OriginalsPage class acts as a unified interface for interacting with all the "Originals" games.
 * It leverages individual game POMs (Dice, Crash, Hi-Lo, Roulette).
 */
export class OriginalsPage extends BasePage<OriginalsMap> {
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
	 */
	public constructor(
		page: Page,
		private diceGamePage: DiceGamePage,
		private crashGamePage: CrashGamePage,
		private hiloGamePage: HiloGamePage,
		private rouletteGamePage: RouletteGamePage,
		private plinkoGamePage: PlinkoGamePage,
	) {
		super(page, new OriginalsMap(page));
		this.gamesMap = {
			Dice: this.diceGamePage,
			Crash: this.crashGamePage,
			Roulette: this.rouletteGamePage,
			HiLo: this.hiloGamePage,
			Plinko: this.plinkoGamePage,
		};
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
	@step()
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
	 *
	 * If no suitable parameter is provided, a default value or option is used.
	 *
	 * @param {OriginalGames} game - The game to place a bet on.
	 * @param {number} betAmount - The amount of the bet.
	 * @param {number | RouletteBetColor | HiloBetOption} [multiplierOrColorOrOption] - An optional parameter that can represent multiplier, color, or betting option, depending on the game.
	 * @returns {Promise<void>} A promise that resolves when the bet has been placed.
	 */
	@step()
	public async placeBet(
		game: OriginalGames,
		betAmount: number,
		multiplierOrColorOrOption?: number | RouletteBetColor | HiloBetOption,
	): Promise<void> {
		const gamePage = this.gamesMap[game];
		const isNumber = typeof multiplierOrColorOrOption === "number";
		const isString = typeof multiplierOrColorOrOption === "string";
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
			default: {
				throw new Error(`Unhandled game type: ${String(game)}`);
			}
		}
	}

	@step()
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
			default: {
				throw new Error(`Unhandled game type: ${String(game)}`);
			}
		}
	}
}
