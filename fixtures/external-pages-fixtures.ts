import { test as base } from "@playwright/test";
import { SteamAuthPage } from "@pages/external/steam/steam-auth-page";
import { SteamBlockedPage } from "@pages/external/steam/steam-blocked-page";

export type ExternalPages = {
	steamAuthPage: SteamAuthPage;
	steamBlockedPage: SteamBlockedPage;
};

export const externalPagesFixtures = base.extend<ExternalPages>({
	steamAuthPage: async ({ page }, use) => {
		await use(new SteamAuthPage(page));
	},
	steamBlockedPage: async ({ page }, use) => {
		await use(new SteamBlockedPage(page));
	},
});
