import { test as base } from "@playwright/test";
import { SteamAuthPage } from "@pages/external/steam/steam-auth-page";
import { SteamBlockedPage } from "@pages/external/steam/steam-blocked-page";
import { GoogleAuthPage } from "@pages/external/google/google-auth-page";

export type ExternalPages = {
	steamAuthPage: SteamAuthPage;
	steamBlockedPage: SteamBlockedPage;
	googleAuthPage: GoogleAuthPage;
};

export const externalPagesFixtures = base.extend<ExternalPages>({
	steamAuthPage: async ({ page }, use) => {
		await use(new SteamAuthPage(page));
	},
	steamBlockedPage: async ({ page }, use) => {
		await use(new SteamBlockedPage(page));
	},
	googleAuthPage: async ({ page }, use) => {
		await use(new GoogleAuthPage(page));
	},
});
