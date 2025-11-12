import { test as base } from "@playwright/test";
import { SteamAuthPage } from "@pages/external/steam/steam-auth-page";
import { SteamBlockedPage } from "@pages/external/steam/steam-blocked-page";
import { GoogleAuthPage } from "@pages/external/google/google-auth-page";
import { VeriffPortalPage } from "@pages/external/veriff-portal/veriff-portal-page";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";

export type ExternalPages = {
	browserSessionManager: BrowserSessionManager;
	steamAuthPage: SteamAuthPage;
	steamBlockedPage: SteamBlockedPage;
	googleAuthPage: GoogleAuthPage;
	veriffPortalPage: VeriffPortalPage;
};

export const externalPagesFixtures = base.extend<ExternalPages>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	steamAuthPage: sessionAwarePage(SteamAuthPage),
	steamBlockedPage: sessionAwarePage(SteamBlockedPage),
	googleAuthPage: sessionAwarePage(GoogleAuthPage),
	veriffPortalPage: sessionAwarePage(VeriffPortalPage),
});
