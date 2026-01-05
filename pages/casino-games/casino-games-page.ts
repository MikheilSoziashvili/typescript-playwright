import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";

import { CasinoGameConfig } from "@core/interfaces";
import { CasinoGamesPage } from "@core/types/types";
import {
	BaccaratBetSpot,
	BaccaratChipValue,
} from "@enums/baccarat-game-options";
import { CasinoGameName, GameProvider, RoundOutcome } from "@enums/casino-game";
import { testData } from "test-data/test-data-manager";
import { BookOfPyramidsPage } from "./bgaming/book-of-pyramids/book-of-pyramids-page";
import { CasinoGamesPageAsserter } from "./casino-games-page-asserter";
import { CasinoGamesPageMap } from "./casino-games-page-map";
import { CasinoGamesPageSteps } from "./casino-games-page-steps";
import { ZuluGoldPage } from "./elk-studios/zulu-gold/zulu-gold-page";
import { LiveBaccaratSqueezePage } from "./evolution-gaming/live-baccarat-squeeze/live-baccarat-squeeze-page";
import { CashVaultIPage } from "./hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import { BookOfArabiaPage } from "./wickedgames/book-of-arabia/book-of-arabia-page";
import { SweetBonanzaPage } from "./pragmatic-play/sweet-bonanza/sweet-bonanza-page";
import { SweetBonanzaCandyLandPage } from "./pragmatic-play-live/sweet-bonanza-candy-land/sweet-bonanza-candy-land-page";

/**
 * Maps each game to its corresponding provider.
 * Ensures only valid game-provider combinations are used.
 */
const GAME_PROVIDER_MAP: Record<CasinoGameName, GameProvider> = {
	[CasinoGameName.BOOK_OF_PYRAMIDS]: GameProvider.BGAMING,
	[CasinoGameName.CASH_VAULT_I]: GameProvider.HACKSAW_GAMING,
	[CasinoGameName.BOOK_OF_ARABIA]: GameProvider.WICKED_GAMES,
	[CasinoGameName.BARREL_BONANZA]: GameProvider.HACKSAW_GAMING,
	[CasinoGameName.MYSTIC_CHIEF]: GameProvider.BGAMING,
	[CasinoGameName.LIVE_BACCARAT_SQUEEZE]: GameProvider.EVOLUTION_GAMING,
	[CasinoGameName.ZULU_GOLD]: GameProvider.ELK_STUDIOS,
	[CasinoGameName.SWEET_BONANZA]: GameProvider.PRAGMATIC_PLAY,
	[CasinoGameName.SWEET_BONANZA_CANDYLAND]: GameProvider.PRAGMATIC_PLAY_LIVE,
};

/**
 * The CasinoGamesUnifiedPage class acts as a unified interface for interacting with all casino games.
 * It leverages individual game POMs and provides a consistent API for playing rounds.
 */
export class CasinoGamesUnifiedPage extends BasePage<CasinoGamesPageMap> {
	/**
	 * A map that associates each game to its corresponding page object.
	 */
	private gamesMap: Partial<Record<CasinoGameName, CasinoGamesPage>>;

	public constructor(
		page: Page,
		private bookOfPyramidsPage: BookOfPyramidsPage,
		private cashVaultIPage: CashVaultIPage,
		private bookOfArabiaPage: BookOfArabiaPage,
		private liveBaccaratSqueezePage: LiveBaccaratSqueezePage,
		private zuluGoldPage: ZuluGoldPage,
		private sweetBonanzaPage: SweetBonanzaPage,
		private sweetBonanzaCandyLandPage: SweetBonanzaCandyLandPage,
	) {
		super(page, new CasinoGamesPageMap(page));
		this.gamesMap = {
			[CasinoGameName.BOOK_OF_PYRAMIDS]: this.bookOfPyramidsPage,
			[CasinoGameName.CASH_VAULT_I]: this.cashVaultIPage,
			[CasinoGameName.BOOK_OF_ARABIA]: this.bookOfArabiaPage,
			[CasinoGameName.LIVE_BACCARAT_SQUEEZE]:
				this.liveBaccaratSqueezePage,
			[CasinoGameName.ZULU_GOLD]: this.zuluGoldPage,
			[CasinoGameName.SWEET_BONANZA]: this.sweetBonanzaPage,
			[CasinoGameName.SWEET_BONANZA_CANDYLAND]:
				this.sweetBonanzaCandyLandPage,
		};
	}

	public override assertThat(): CasinoGamesPageAsserter {
		return new CasinoGamesPageAsserter(this);
	}

	public steps(): CasinoGamesPageSteps {
		return new CasinoGamesPageSteps(this);
	}

	/**
	 * Validates that the game and provider combination is valid.
	 *
	 * @param config - The game configuration to validate
	 * @throws Error if the game-provider combination is invalid
	 */
	private validateGameProviderMatch(config: CasinoGameConfig): void {
		const expectedProvider = GAME_PROVIDER_MAP[config.gameName];

		if (expectedProvider !== config.gameProvider) {
			throw new Error(
				`Invalid game-provider combination: ${config.gameName} should be played with ${expectedProvider}, not ${config.gameProvider}`,
			);
		}
	}

	/**
	 * Gets the game page object for the specified game configuration.
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @returns The game page object
	 */
	public getGamePage(config: CasinoGameConfig): CasinoGamesPage {
		this.validateGameProviderMatch(config);
		const gamePage = this.gamesMap[config.gameName];

		if (!gamePage) {
			throw new Error(
				`Game not found: ${config.gameProvider}/${config.gameName}`,
			);
		}

		return gamePage;
	}

	/**
	 * Plays a casino game round until the specified outcome is detected
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @param roundOutcome - The desired round outcome (WIN or LOSE)
	 */
	@step(
		"Play round until {roundOutcome} for {config.gameProvider}/{config.gameName}",
	)
	public async playCasinoGameRound(
		config: CasinoGameConfig,
		roundOutcome: RoundOutcome,
	): Promise<void> {
		const gamePage = this.getGamePage(config);
		const isWin = roundOutcome === RoundOutcome.WIN;

		switch (config.gameProvider) {
			case GameProvider.BGAMING: {
				const bookOfPyramidsPage = gamePage as BookOfPyramidsPage;
				if (isWin) {
					await bookOfPyramidsPage
						.steps()
						.playUntilWonAndGetResults();
				} else {
					await bookOfPyramidsPage
						.steps()
						.playUntilLostAndGetResults();
				}
				break;
			}
			case GameProvider.HACKSAW_GAMING: {
				const cashVaultIPage = gamePage as CashVaultIPage;
				if (isWin) {
					await cashVaultIPage.steps().scratchCardsUntilWon();
				} else {
					await cashVaultIPage.steps().scratchCardsUntilLost();
				}
				break;
			}
			case GameProvider.WICKED_GAMES: {
				const bookOfArabiaPage = gamePage as BookOfArabiaPage;
				const betTestData = testData()
					.fromObject()
					.bet.build({ username: "default" }, { betAmount: 200 });
				if (isWin) {
					await bookOfArabiaPage
						.steps()
						.spinUntilWon(betTestData.betAmount);
				} else {
					await bookOfArabiaPage
						.steps()
						.spinUntilLost(betTestData.betAmount);
				}
				break;
			}
			case GameProvider.EVOLUTION_GAMING: {
				const liveBaccaratSqueezePage =
					gamePage as LiveBaccaratSqueezePage;
				const baccaratBetDataWin = {
					betSpots: [
						BaccaratBetSpot.TIE,
						BaccaratBetSpot.PLAYER,
						BaccaratBetSpot.BANKER,
					],
					betAmount: BaccaratChipValue.TWO,
				};
				const baccaratBetDataLoss = {
					betSpots: [BaccaratBetSpot.TIE],
					betAmount: BaccaratChipValue.TWO,
				};
				if (isWin) {
					await liveBaccaratSqueezePage
						.steps()
						.playUntilWonAndGetResults(baccaratBetDataWin);
				} else {
					await liveBaccaratSqueezePage
						.steps()
						.playUntilLostAndGetResults(baccaratBetDataLoss);
				}
				break;
			}
			case GameProvider.ELK_STUDIOS: {
				const zuluGoldPage = gamePage as ZuluGoldPage;
				const spinCount = testData()
					.fromObject()
					.bet.build({ username: "default" }, { betAmount: 30 });
				await zuluGoldPage.clickNextButton();
				if (isWin) {
					await zuluGoldPage
						.steps()
						.spinUntilWinRound(spinCount.betAmount);
				} else {
					await zuluGoldPage
						.steps()
						.spinUntilLoseRound(spinCount.betAmount);
				}
				break;
			}
			case GameProvider.PRAGMATIC_PLAY: {
				const sweetBonanzaPage = gamePage as SweetBonanzaPage;
				const spinCount = testData()
					.fromObject()
					.bet.build({ username: "default" }, { betAmount: 30 });
				await sweetBonanzaPage.clickNextButton();
				if (isWin) {
					await sweetBonanzaPage
						.steps()
						.spinUntilWinRound(spinCount.betAmount);
				} else {
					await sweetBonanzaPage
						.steps()
						.spinUntilLoseRound(spinCount.betAmount);
				}
				break;
			}
			case GameProvider.PRAGMATIC_PLAY_LIVE: {
				const sweetBonanzaCandyLandPage =
					gamePage as SweetBonanzaCandyLandPage;
				const maxRounds = 30;
				if (isWin) {
					await sweetBonanzaCandyLandPage
						.steps()
						.playUntilWinRound(maxRounds);
				} else {
					await sweetBonanzaCandyLandPage
						.steps()
						.playUntilLossRound(maxRounds);
				}
				break;
			}
			default: {
				throw new Error(
					`Unhandled game provider: ${String(config.gameProvider)}`,
				);
			}
		}
	}
}
