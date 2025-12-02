import { test as base } from "@playwright/test";
import { ZuluGoldPage } from "@pages/casino-games/elk-studios/zulu-gold/zulu-gold-page";

export type VisualAutomationPages = {
	zuluGoldPage: ZuluGoldPage;
};

export const visualAutomationFixtures = base.extend<VisualAutomationPages>({
	zuluGoldPage: async ({ page }, use) => {
		const zuluGoldPage = new ZuluGoldPage(page);
		await use(zuluGoldPage);
	},
});
