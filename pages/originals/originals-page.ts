import {
	BetOption,
	isNumberBetOption,
	isObjectBetOptions,
	isStringBetOption,
	OriginalGames,
	OriginalGamesPage,
} from "@core/types/types";
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
import { BlackjackGamePage } from "@pages/blackjack-game-page/blackjack-game-page";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";
import { LimboGamePage } from "@pages/limbo-game-page/limbo-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { PocketDicePage } from "@pages/pocket-dice-game/pocket-dice-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { step } from "decorators/step";
import { sanitizeAmount } from "support/regex-patterns";
import { Page } from "playwright";
import { OriginalsAsserter } from "./originals-page-asserter";
import { OriginalsMap } from "./originals-page-map";
import { OriginalsSteps } from "./originals-page-steps";
import { Toast } from "@pages/components/toast/toast";
import { VisibilityState } from "@enums/playwright/visibility-states";

type OriginalsDeps = {
	diceGamePage: DiceGamePage;
	crashGamePage: CrashGamePage;
	hiloGamePage: HiloGamePage;
	rouletteGamePage: RouletteGamePage;
	plinkoGamePage: PlinkoGamePage;
	minesGamePage: MinesGamePage;
	kenoGamePage: KenoGamePage;
	pocketDicePage: PocketDicePage;
	limboGamePage: LimboGamePage;
	blackjackGamePage: BlackjackGamePage;
};

export type GameHandlers = {
	setBetAmount?: (amount: number) => Promise<void>;
	typeBetAmount?: (amount: string) => Promise<void>;
	pressMinButton?: () => Promise<void>;
	pressHalfButton?: () => Promise<void>;
	pressMaxButton?: () => Promise<void>;
	pressDoubleButton?: () => Promise<void>;
	getBetAmountValue?: () => Promise<string>;
};

type GameStrategy = {
	page: OriginalGamesPage;
	placeBet: (amount: number, option?: BetOption) => Promise<void>;
	waitForRoundFinish: () => Promise<void>;
	getYourBetValue?: () => Promise<number>;
	handlers?: GameHandlers;
};

export class OriginalsPage extends BasePage<OriginalsMap> {
	public readonly toast: Toast;

	private readonly strategies: Record<OriginalGames, GameStrategy>;

	public constructor(page: Page, deps?: Partial<OriginalsDeps>) {
		super(page, new OriginalsMap(page));

		const dice = deps?.diceGamePage ?? new DiceGamePage(page);
		const crash = deps?.crashGamePage ?? new CrashGamePage(page);
		const hilo = deps?.hiloGamePage ?? new HiloGamePage(page);
		const roulette = deps?.rouletteGamePage ?? new RouletteGamePage(page);
		const plinko = deps?.plinkoGamePage ?? new PlinkoGamePage(page);
		const mines = deps?.minesGamePage ?? new MinesGamePage(page);
		const keno = deps?.kenoGamePage ?? new KenoGamePage(page);
		const pocketDice = deps?.pocketDicePage ?? new PocketDicePage(page);
		const limbo = deps?.limboGamePage ?? new LimboGamePage(page);
		const blackjack =
			deps?.blackjackGamePage ?? new BlackjackGamePage(page);

		const defaultMultiplier = 1.1;

		this.strategies = {
			[OriginalGame.Dice]: {
				page: dice,
				placeBet: async (amount, option) => {
					const multiplier = isNumberBetOption(option)
						? option
						: defaultMultiplier;
					await dice.placeBet(amount, multiplier);
				},
				waitForRoundFinish: () =>
					dice.assertThat().diceResultIsDisplayed(),
			},
			[OriginalGame.Crash]: {
				page: crash,
				placeBet: async (amount, option) => {
					const multiplier = isNumberBetOption(option)
						? option
						: defaultMultiplier;
					await crash.placeBet(amount, multiplier);
				},
				waitForRoundFinish: async () => {
					await crash.waitPreviousBetRoundFinish();
					await crash.waitBettingWindowAvailable();
				},
			},
			[OriginalGame.Roulette]: {
				page: roulette,
				placeBet: async (amount, option) => {
					const betColor = isStringBetOption(option)
						? (option as RouletteBetColor)
						: RouletteBetColor.RED;
					await roulette.placeBet(amount, betColor);
				},
				waitForRoundFinish: async () => {
					await roulette.waitBettingWindowAvailable();
					await roulette.waitRoundResultNumber();
				},
			},
			[OriginalGame.HiLo]: {
				page: hilo,
				placeBet: async (amount, option) => {
					const betOption = isStringBetOption(option)
						? (option as HiloBetOption)
						: HiloBetOption.RED;
					await hilo.placeBet(amount, betOption);
				},
				waitForRoundFinish: async () => {
					await hilo.waitBettingWindowAvailable();
					await hilo.waitRoundResult();
				},
			},
			[OriginalGame.Plinko]: {
				page: plinko,
				placeBet: async (amount, option) => {
					const plinkoOptions = isObjectBetOptions(option)
						? (option as {
								rowsValue?: PlinkoRowsOption;
								riskValue?: PlinkoRiskOption;
							})
						: {};
					await plinko.startManualBet(
						amount.toString(),
						plinkoOptions,
					);
				},
				waitForRoundFinish: () =>
					plinko.steps().waitForSlidersToBeActive(),
				getYourBetValue: () => plinko.getYourBetValue(),
				handlers: {
					setBetAmount: (amount) => plinko.fillInBetAmount(amount),
					typeBetAmount: (amount) => plinko.typeInBetAmount(amount),
					pressMinButton: () => plinko.pressMinButton(),
					pressHalfButton: () => plinko.pressHalfButton(),
					pressMaxButton: () => plinko.pressMaxButton(),
					pressDoubleButton: () => plinko.pressDoubleButton(),
					getBetAmountValue: () => plinko.getBetAmountValue(),
				},
			},
			[OriginalGame.Mines]: {
				page: mines,
				placeBet: async (amount, option) => {
					await mines.assertThat().startPlayingButtonIsDisplayed();
					await mines.steps().placeManualBetWithRandomTile({
						betAmount: amount,
						minesNumber: isNumberBetOption(option) ? option : 0,
						cashoutMultiplier: 0,
					});
				},
				waitForRoundFinish: async () => {
					const bombHit = await mines.map.bombTile.isVisible();

					if (bombHit) {
						await mines
							.assertThat()
							.startPlayingButtonIsDisplayed();
						await mines.steps().placeManualBetWithRandomTile({
							betAmount: 1,
							minesNumber: 0,
							cashoutMultiplier: 0,
						});
					}

					const isCashoutAvailable =
						await mines.map.manualCashoutButton.isVisible();

					if (isCashoutAvailable) {
						await mines.steps().performManualCashout();
					}
					await mines
						.assertThat()
						.pickRandomTileButtonIsNotDisplayed();
				},
				getYourBetValue: () => mines.getYourBetValue(),
				handlers: {
					setBetAmount: (amount) => mines.fillInBetAmount(amount),
					typeBetAmount: (amount) => mines.typeInBetAmount(amount),
					pressMinButton: () => mines.pressMinButton(),
					pressHalfButton: () => mines.pressHalfButton(),
					pressMaxButton: () => mines.pressMaxButton(),
					pressDoubleButton: () => mines.pressDoubleButton(),
					getBetAmountValue: () => mines.getBetAmountValue(),
				},
			},
			[OriginalGame.Keno]: {
				page: keno,
				placeBet: async (amount) => {
					await keno.assertThat().startPlayingButtonIsDisplayed();
					await keno.steps().startManualBet(amount);
				},
				waitForRoundFinish: () =>
					keno.assertThat().verifyRiskSliderActive(),
				getYourBetValue: () => keno.getYourBetValue(),
				handlers: {
					setBetAmount: (amount) => keno.fillInBetAmount(amount),
					typeBetAmount: (amount) => keno.typeInBetAmount(amount),
					pressMinButton: () => keno.pressMinButton(),
					pressHalfButton: () => keno.pressHalfButton(),
					pressMaxButton: () => keno.pressMaxButton(),
					pressDoubleButton: () => keno.pressDoubleButton(),
					getBetAmountValue: () => keno.getBetAmountValue(),
				},
			},
			[OriginalGame.PocketDice]: {
				page: pocketDice,
				placeBet: async (amount) => {
					await pocketDice.map.betAmountInput.fill(amount.toString());
					await pocketDice.placeSingleBet();
					await pocketDice.map.rollButton.click();
				},
				waitForRoundFinish: async () => {
					let won = false;
					try {
						await pocketDice.map.winBanner.waitFor({
							state: VisibilityState.VISIBLE,
							timeout: 3000,
						});
						won = true;
					} catch {
						// Lost — no win banner displayed
					}
					if (won) {
						await pocketDice.map.takeButton.click();
					}
					await pocketDice.assertThat().rollDiceButtonVisible();
				},
			},
			[OriginalGame.Limbo]: {
				page: limbo,
				placeBet: async (amount, option) => {
					await limbo.map.betAmountInput.fill(amount.toString());
					await limbo.placeSingleBet(
						isNumberBetOption(option) ? option : 1.5,
					);
				},
				waitForRoundFinish: () =>
					limbo.assertThat().rollButtonIsVisible(),
			},
			[OriginalGame.Blackjack]: {
				page: blackjack,
				placeBet: async (amount) => {
					await blackjack.map.betAmountInput.fill(amount.toString());
					await blackjack.placeSingleBet();
				},
				waitForRoundFinish: () =>
					blackjack.assertThat().playButtonIsVisible(),
			},
		};

		this.toast = new Toast(this.page);
	}

	public get handlers(): Partial<Record<OriginalGame, GameHandlers>> {
		const result: Partial<Record<OriginalGame, GameHandlers>> = {};
		for (const [game, strategy] of Object.entries(this.strategies)) {
			if (strategy.handlers) {
				result[game as OriginalGame] = strategy.handlers;
			}
		}
		return result;
	}

	public override assertThat(): OriginalsAsserter {
		return new OriginalsAsserter(this);
	}

	public steps(): OriginalsSteps {
		return new OriginalsSteps(this);
	}

	@step("Navigate to game")
	public async navigateToGame(game: OriginalGames): Promise<void> {
		await this.strategies[game].page.navigate();
	}

	@step("Place bet")
	public async placeBet(
		game: OriginalGames,
		betAmount: number,
		multiplierOrColorOrOption?: BetOption,
	): Promise<void> {
		await this.strategies[game].placeBet(
			betAmount,
			multiplierOrColorOrOption,
		);
	}

	@step("Navigate to game and place bet")
	public async navigateAndPlaceBet(
		game: OriginalGames,
		betAmount: number,
		multiplierOrColorOrOption?: BetOption,
	): Promise<void> {
		await this.navigateToGame(game);
		await this.placeBet(game, betAmount, multiplierOrColorOrOption);
	}

	@step("Wait for game round finish")
	public async waitForGameRoundFinish(game: OriginalGames): Promise<void> {
		await this.strategies[game].waitForRoundFinish();
	}

	public getMinBetAmount(game: OriginalGame): number {
		return MinBetAmount[game.toUpperCase() as keyof typeof MinBetAmount];
	}

	public getMaxBetAmount(game: OriginalGame): number {
		return MaxBetAmount[game.toUpperCase() as keyof typeof MaxBetAmount];
	}

	@step("Get 'Your Bet' value for game")
	public async getYourBetValueForGame(game: OriginalGame): Promise<number> {
		const strategy = this.strategies[game];
		if (!strategy.getYourBetValue) {
			throw new Error(
				`Get your bet value method not implemented for ${game}`,
			);
		}
		return strategy.getYourBetValue();
	}

	@step("Get jackpot amount")
	public async getJackpotAmount(): Promise<number> {
		const text = await this.map.jackpotCounter.innerText();
		return parseFloat(text.replace(sanitizeAmount, ""));
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
		const toastGames: OriginalGames[] = [
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
