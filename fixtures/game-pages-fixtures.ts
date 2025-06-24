import { test as base } from "@playwright/test";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { OriginalsPage } from "@pages/originals/originals-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";

export type GamePages = {
	originalsPage: OriginalsPage;
	crashGamePage: CrashGamePage;
	diceGamePage: DiceGamePage;
	rouletteGamePage: RouletteGamePage;
	hiloGamePage: HiloGamePage;
	plinkoGamePage: PlinkoGamePage;
	minesGamePage: MinesGamePage;
	kenoGamePage: KenoGamePage;
};

export const gamePagesFixtures = base.extend<GamePages>({
	crashGamePage: async ({ page }, use) => {
		await use(new CrashGamePage(page));
	},
	diceGamePage: async ({ page }, use) => {
		await use(new DiceGamePage(page));
	},
	hiloGamePage: async ({ page }, use) => {
		await use(new HiloGamePage(page));
	},
	rouletteGamePage: async ({ page }, use) => {
		await use(new RouletteGamePage(page));
	},
	plinkoGamePage: async ({ page }, use) => {
		await use(new PlinkoGamePage(page));
	},
	minesGamePage: async ({ page }, use) => {
		await use(new MinesGamePage(page));
	},
	kenoGamePage: async ({ page }, use) => {
		await use(new KenoGamePage(page));
	},
	originalsPage: async (
		{
			page,
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
		await use(
			new OriginalsPage(
				page,
				diceGamePage,
				crashGamePage,
				hiloGamePage,
				rouletteGamePage,
				plinkoGamePage,
				minesGamePage,
				kenoGamePage,
			),
		);
	},
});
