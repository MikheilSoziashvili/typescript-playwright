import { test as base } from "@playwright/test";
import { ZuluGoldPage } from "@pages/casino-games/elk-studios/zulu-gold/zulu-gold-page";
import { SweetBonanzaPage } from "@pages/casino-games/pragmatic-play/sweet-bonanza/sweet-bonanza-page";

export type VisualAutomationPages = {
	zuluGoldPage: ZuluGoldPage;
	sweetBonanzaPage: SweetBonanzaPage;
};

export const visualAutomationFixtures = base.extend<VisualAutomationPages>({
	zuluGoldPage: async ({ page }, use) => {
		const zuluGoldPage = new ZuluGoldPage(page);
		await use(zuluGoldPage);
	},
	sweetBonanzaPage: async ({ page }, use) => {
		const sweetBonanzaPage = new SweetBonanzaPage(page);
		await use(sweetBonanzaPage);
	},
});
