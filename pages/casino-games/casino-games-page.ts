import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";

import { BookOfPyramidsPage } from "./bgaming/book-of-pyramids/book-of-pyramids-page";
import { CashVaultIPage } from "./hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import { BookOfArabiaPage } from "./wickedgames/book-of-arabia/book-of-arabia-page";
import { GameProvider, CasinoGameName } from "@enums/casino-game";
import { CasinoGamesPage } from "@core/types/types";
import { CasinoGameConfig } from "@core/interfaces";
import { CasinoGamesPageMap } from "./casino-games-page-map";
import { CasinoGamesPageAsserter } from "./casino-games-page-asserter";
import { CasinoGamesPageSteps } from "./casino-games-page-steps";
import { BetTestDataObjectFactory } from "test-data/objects/factories/bet-test-data-object-factory";

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
	) {
		super(page, new CasinoGamesPageMap(page));
		this.gamesMap = {
			[CasinoGameName.BOOK_OF_PYRAMIDS]: this.bookOfPyramidsPage,
			[CasinoGameName.CASH_VAULT_I]: this.cashVaultIPage,
			[CasinoGameName.BOOK_OF_ARABIA]: this.bookOfArabiaPage,
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
	 * Plays a game round for the specified game.
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @returns A promise that resolves when the round has been played
	 */
	@step("Play round for {config.gameProvider}/{config.gameName}")
	public async playCasinoGameRound(config: CasinoGameConfig): Promise<void> {
		const gamePage = this.getGamePage(config);

		switch (config.gameProvider) {
			case GameProvider.BGAMING: {
				const bookOfPyramidsPage = gamePage as BookOfPyramidsPage;
				await bookOfPyramidsPage.steps().playUntilWonAndGetResults();
				break;
			}
			case GameProvider.HACKSAW_GAMING: {
				const cashVaultIPage = gamePage as CashVaultIPage;
				await cashVaultIPage.steps().buyAndScratchAllCards();
				break;
			}
			case GameProvider.WICKED_GAMES: {
				const bookOfArabiaPage = gamePage as BookOfArabiaPage;
				const betTestData = BetTestDataObjectFactory.build(
					{ username: "default" },
					{ betAmount: 200 },
				);
				await bookOfArabiaPage
					.steps()
					.startGameAndSpin(betTestData.betAmount);
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
