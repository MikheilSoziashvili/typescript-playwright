import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home-page/home-page";
import { AffiliatesPage } from "@pages/affiliates/affiliates-page";
import { RewardsPage } from "@pages/rewards/rewards-page";
import { RewardsExplorePage } from "@pages/rewards/explore/rewards-explore-page";
import { ProfilePage } from "@pages/profile/profile-page";
import { FaqPage } from "@pages/help/faq/faq-page";
import { GeoblockedPage } from "@pages/geoblocked/geoblocked-page";
import { BannedUserPage } from "@pages/banned-user/banned-user-page";
import { EsportsPage } from "@pages/esports-page/esports-page";
import { SlotsBattlePage } from "@pages/slot-battle/slots-battle-page";
import { BlogCategoryPage } from "@pages/blog/category/blog-category-page";
import { SettingsPage } from "@pages/settings/settings-page";
import { HelpPage } from "@pages/help/help-page";

export type GamdomPages = {
	homePage: HomePage;
	affiliatesPage: AffiliatesPage;
	settingsPage: SettingsPage;
	rewardsPage: RewardsPage;
	rewardsExplorePage: RewardsExplorePage;
	profilePage: ProfilePage;
	faqPage: FaqPage;
	geoblockedPage: GeoblockedPage;
	bannedUserPage: BannedUserPage;
	esportsPage: EsportsPage;
	slotsBattlePage: SlotsBattlePage;
	blogCategoryPage: BlogCategoryPage;
	helpPage: HelpPage;
};

export const gamdomPagesFixtures = base.extend<GamdomPages>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	affiliatesPage: async ({ page }, use) => {
		await use(new AffiliatesPage(page));
	},
	settingsPage: async ({ page }, use) => {
		await use(new SettingsPage(page));
	},
	rewardsPage: async ({ page }, use) => {
		await use(new RewardsPage(page));
	},
	rewardsExplorePage: async ({ page }, use) => {
		await use(new RewardsExplorePage(page));
	},
	profilePage: async ({ page }, use) => {
		await use(new ProfilePage(page));
	},
	faqPage: async ({ page }, use) => {
		await use(new FaqPage(page));
	},
	geoblockedPage: async ({ page }, use) => {
		await use(new GeoblockedPage(page));
	},
	bannedUserPage: async ({ page }, use) => {
		await use(new BannedUserPage(page));
	},
	esportsPage: async ({ page }, use) => {
		await use(new EsportsPage(page));
	},
	slotsBattlePage: async ({ page }, use) => {
		await use(new SlotsBattlePage(page));
	},
	blogCategoryPage: async ({ page }, use) => {
		await use(new BlogCategoryPage(page));
	},
	helpPage: async ({ page }, use) => {
		await use(new HelpPage(page));
	},
});
