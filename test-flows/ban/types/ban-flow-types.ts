import { GamdomDb } from "database/gamdom-db";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { GamdomApi } from "@api/gamdom-api";
import { HomePage } from "@pages/home-page/home-page";
import { SteamBlockedPage } from "@pages/external/steam/steam-blocked-page";
import { BanReason } from "@enums/ban-reasons";
import { SteamAuthPage } from "@pages/external/steam/steam-auth-page";
import { ProfilePage } from "@pages/profile/profile-page";

export interface BanUserVerificationParams {
	gamdomDb: GamdomDb;
	browserSessionManager: BrowserSessionManager;
	gamdomApi: GamdomApi;
	homePage: HomePage;
	steamBlockedPage: SteamBlockedPage;
	usernameSteam: string;
	banReason: BanReason;
}

export interface SteamUserLoginLogoutParams {
	gamdomDb: GamdomDb;
	homePage: HomePage;
	steamAuthPage: SteamAuthPage;
	steamBlockedPage: SteamBlockedPage;
	profilePage: ProfilePage;
	usernameSteam: string;
	bannedUsername: string;
	password: string;
}

