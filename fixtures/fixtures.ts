import { HomePage } from "../pages/home-page/home-page";
import { TestInfo, test as base } from "@playwright/test";
import { CrashGamePage } from "../pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "../pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "../pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "../pages/hilo-game-page/hilo-game-page";

type CustomFixtures = Pages;

type Pages = {
	homePage: HomePage;
	crashGamePage: CrashGamePage;
	diceGamePage: DiceGamePage;
	rouletteGamePage: RouletteGamePage;
	hiloGamePage: HiloGamePage;
};

export const test = base.extend<CustomFixtures>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
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

// TODO: To be revised
// eslint-disable-next-line no-empty-pattern -- beforeEach in progress
test.beforeEach(({}, testInfo: TestInfo) => {
	const issueKeyMatch = testInfo.title.match(new RegExp(`\\[([^\\]]+)\\]`));
	if (issueKeyMatch) {
		testInfo.annotations.push({
			type: "test_key",
			description: issueKeyMatch[1],
		});
	}
});
