import { test as base } from "@playwright/test";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";

export type GamePages = {
	crashGamePage: CrashGamePage;
	diceGamePage: DiceGamePage;
	rouletteGamePage: RouletteGamePage;
	hiloGamePage: HiloGamePage;
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
});
