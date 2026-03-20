import { test as base } from "@playwright/test";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { OriginalsPage } from "@pages/originals/originals-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";
import { PocketDicePage } from "@pages/pocket-dice-game/pocket-dice-page";
import { LimboGamePage } from "@pages/limbo-game-page/limbo-game-page";
import { BookOfPyramidsPage } from "@pages/casino-games/bgaming/book-of-pyramids/book-of-pyramids-page";
import { CashVaultIPage } from "@pages/casino-games/hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import { BookOfArabiaPage } from "@pages/casino-games/wickedgames/book-of-arabia/book-of-arabia-page";
import { LiveBaccaratSqueezePage } from "@pages/casino-games/evolution-gaming/live-baccarat-squeeze/live-baccarat-squeeze-page";
import { ZuluGoldPage } from "@pages/casino-games/elk-studios/zulu-gold/zulu-gold-page";
import { CasinoGamesUnifiedPage } from "@pages/casino-games/casino-games-page";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";
import { SweetBonanzaPage } from "@pages/casino-games/pragmatic-play/sweet-bonanza/sweet-bonanza-page";
import { SweetBonanzaCandyLandPage } from "@pages/casino-games/pragmatic-play-live/sweet-bonanza-candy-land/sweet-bonanza-candy-land-page";
import { BlackjackGamePage } from "@pages/blackjack-game-page/blackjack-game-page";
import { SokGamesPage } from "@pages/sok-games/sok-games-page";

export type GamePages = {
	browserSessionManager: BrowserSessionManager;
	originalsPage: OriginalsPage;
	crashGamePage: CrashGamePage;
	diceGamePage: DiceGamePage;
	rouletteGamePage: RouletteGamePage;
	hiloGamePage: HiloGamePage;
	plinkoGamePage: PlinkoGamePage;
	minesGamePage: MinesGamePage;
	kenoGamePage: KenoGamePage;
	pocketDicePage: PocketDicePage;
	bookOfPyramidsPage: BookOfPyramidsPage;
	cashVaultIPage: CashVaultIPage;
	bookOfArabiaPage: BookOfArabiaPage;
	liveBaccaratSqueezePage: LiveBaccaratSqueezePage;
	zuluGoldPage: ZuluGoldPage;
	sweetBonanzaPage: SweetBonanzaPage;
	sweetBonanzaCandyLandPage: SweetBonanzaCandyLandPage;
	limboGamePage: LimboGamePage;
	blackjackGamePage: BlackjackGamePage;
	casinoGamesPage: CasinoGamesUnifiedPage;
	sokGamesPage: SokGamesPage;
};

export const gamePagesFixtures = base.extend<GamePages>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	crashGamePage: sessionAwarePage(CrashGamePage),
	diceGamePage: sessionAwarePage(DiceGamePage),
	hiloGamePage: sessionAwarePage(HiloGamePage),
	rouletteGamePage: sessionAwarePage(RouletteGamePage),
	plinkoGamePage: sessionAwarePage(PlinkoGamePage),
	minesGamePage: sessionAwarePage(MinesGamePage),
	kenoGamePage: sessionAwarePage(KenoGamePage),
	pocketDicePage: sessionAwarePage(PocketDicePage),
	limboGamePage: sessionAwarePage(LimboGamePage),
	blackjackGamePage: sessionAwarePage(BlackjackGamePage),
	bookOfPyramidsPage: sessionAwarePage(BookOfPyramidsPage),
	cashVaultIPage: sessionAwarePage(CashVaultIPage),
	bookOfArabiaPage: sessionAwarePage(BookOfArabiaPage),
	liveBaccaratSqueezePage: sessionAwarePage(LiveBaccaratSqueezePage),
	zuluGoldPage: sessionAwarePage(ZuluGoldPage),
	sweetBonanzaPage: sessionAwarePage(SweetBonanzaPage),
	sweetBonanzaCandyLandPage: sessionAwarePage(SweetBonanzaCandyLandPage),

	originalsPage: async (
		{
			browserSessionManager,
			diceGamePage,
			crashGamePage,
			hiloGamePage,
			rouletteGamePage,
			plinkoGamePage,
			minesGamePage,
			kenoGamePage,
		},
		use,
	) => {
		const page = browserSessionManager.active.page;
		const originals = new OriginalsPage(
			page,
			diceGamePage,
			crashGamePage,
			hiloGamePage,
			rouletteGamePage,
			plinkoGamePage,
			minesGamePage,
			kenoGamePage,
		);
		await use(originals);
	},

	sokGamesPage: async (
		{
			browserSessionManager,
			minesGamePage,
			plinkoGamePage,
			kenoGamePage,
			pocketDicePage,
			limboGamePage,
			blackjackGamePage,
		},
		use,
	) => {
		const page = browserSessionManager.active.page;
		const sokGames = new SokGamesPage(
			page,
			minesGamePage,
			plinkoGamePage,
			kenoGamePage,
			pocketDicePage,
			limboGamePage,
			blackjackGamePage,
		);
		await use(sokGames);
	},

	casinoGamesPage: async (
		{
			browserSessionManager,
			bookOfPyramidsPage,
			cashVaultIPage,
			bookOfArabiaPage,
			liveBaccaratSqueezePage,
			zuluGoldPage,
			sweetBonanzaPage,
			sweetBonanzaCandyLandPage,
		},
		use,
	) => {
		const page = browserSessionManager.active.page;
		const casinoGames = new CasinoGamesUnifiedPage(
			page,
			bookOfPyramidsPage,
			cashVaultIPage,
			bookOfArabiaPage,
			liveBaccaratSqueezePage,
			zuluGoldPage,
			sweetBonanzaPage,
			sweetBonanzaCandyLandPage,
		);
		await use(casinoGames);
	},
});
