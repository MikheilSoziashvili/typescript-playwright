import { HomePage } from "../pages/home-page/home-page";
import { TestInfo, test as base } from "@playwright/test";
import { CrashGamePage } from "../pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "../pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "../pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "../pages/hilo-game-page/hilo-game-page";
import { AffiliatesPage } from "../pages/affiliates/affiliates-page";
import { RewardsPage } from "../pages/rewards/rewards-page";
import { ProfilePage } from "../pages/profile/profile-page";
import { FaqPage } from "../pages/help/faq/faq-page";

type CustomFixtures = Pages;

export type Pages = {
	homePage: HomePage;
	crashGamePage: CrashGamePage;
	diceGamePage: DiceGamePage;
	rouletteGamePage: RouletteGamePage;
	hiloGamePage: HiloGamePage;
	affiliatesPage: AffiliatesPage;
	rewardsPage: RewardsPage;
	profilePage: ProfilePage;
	faqPage: FaqPage;
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
	affiliatesPage: async ({ page }, use) => {
		await use(new AffiliatesPage(page));
	},
	rewardsPage: async ({ page }, use) => {
		await use(new RewardsPage(page));
	},
	profilePage: async ({ page }, use) => {
		await use(new ProfilePage(page));
	},
	faqPage: async ({ page }, use) => {
		await use(new FaqPage(page));
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
