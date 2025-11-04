import { test as base } from "@playwright/test";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { OriginalsPage } from "@pages/originals/originals-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";
import { BookOfPyramidsPage } from "@pages/casino-games/bgaming/book-of-pyramids/book-of-pyramids-page";
import { CashVaultIPage } from "@pages/casino-games/hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";

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
	bookOfPyramidsPage: BookOfPyramidsPage;
	bubblesBonanzaPage: CashVaultIPage;
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
	bookOfPyramidsPage: sessionAwarePage(BookOfPyramidsPage),
	bubblesBonanzaPage: sessionAwarePage(CashVaultIPage),

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
});
