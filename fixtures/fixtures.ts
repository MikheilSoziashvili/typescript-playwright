import { HomePage } from "../pages/home-page/home-page";
import { test as base } from "@playwright/test";
import { CrashGamePage } from "../pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "../pages/dice-game-page/dice-game-page";
import { RouletteGamePage } from "../pages/roulette-game-page/roulette-game-page";
import { HiloGamePage } from "../pages/hilo-game-page/hilo-game-page";
import { AffiliatesPage } from "../pages/affiliates/affiliates-page";
import { RewardsPage } from "../pages/rewards/rewards-page";
import { ProfilePage } from "../pages/profile/profile-page";
import { FaqPage } from "../pages/help/faq/faq-page";
import { Notification } from "../pages/components/notification/notification";
import { Toast } from "../pages/components/toast/toast";
import { UserInfoAdminPage } from "../pages/admin/user-info-admin/user-info-admin-page";
import { BannedUserPage } from "../pages/banned-user/banned-user-page";
import { InfoAdminPage } from "../pages/admin/info-admin/info-admin-page";

export type Pages = {
	userInfoAdminPage: UserInfoAdminPage;
	infoAdminPage: InfoAdminPage;
	homePage: HomePage;
	crashGamePage: CrashGamePage;
	diceGamePage: DiceGamePage;
	rouletteGamePage: RouletteGamePage;
	hiloGamePage: HiloGamePage;
	affiliatesPage: AffiliatesPage;
	rewardsPage: RewardsPage;
	profilePage: ProfilePage;
	faqPage: FaqPage;
	bannedUserPage: BannedUserPage;
};

export type Components = {
	notifications: Notification;
	toast: Toast;
};

type CustomFixtures = Pages & Components;

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
	userInfoAdminPage: async ({ page }, use) => {
		await use(new UserInfoAdminPage(page));
	},
	infoAdminPage: async ({ page }, use) => {
		await use(new InfoAdminPage(page));
	},
	bannedUserPage: async ({ page }, use) => {
		await use(new BannedUserPage(page));
	},
	notifications: async ({ page }, use) => {
		await use(new Notification(page));
	},
	toast: async ({ page }, use) => {
		await use(new Toast(page));
	},
});
