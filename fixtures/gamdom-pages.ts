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
import { MaintenancePage } from "@pages/maintenance/maintenance-page";
import { CasinoPage } from "@pages/casino/casino-game-page";
import { ProvidersPage } from "@pages/providers/providers-page";
import { VerificationPage } from "@pages/verification/verification-page";
import { KothPage } from "@pages/koth/koth-page";
import { TransactionsPage } from "@pages/transactions/transactions-page";
import { BlogPage } from "@pages/blog/blog-page";
import { BlogPostPage } from "@pages/blog/post/blog-post-page";
import { StatisticsPage } from "@pages/statistics/statistics-page";
import { PromotionsPage } from "@pages/promotions/promotions-page";
import { PromotionPage } from "@pages/promotion/promotion-page";
import { NotificationsPage } from "@pages/notifications/notifications-page";
import { PrivacyPage } from "@pages/privacy/privacy-page";
import { SportsPage } from "@pages/sports/sports-page";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";

export type GamdomPages = {
	browserSessionManager: BrowserSessionManager;
	homePage: HomePage;
	affiliatesPage: AffiliatesPage;
	settingsPage: SettingsPage;
	rewardsPage: RewardsPage;
	rewardsExplorePage: RewardsExplorePage;
	profilePage: ProfilePage;
	verificationPage: VerificationPage;
	statisticsPage: StatisticsPage;
	faqPage: FaqPage;
	geoblockedPage: GeoblockedPage;
	bannedUserPage: BannedUserPage;
	maintenancePage: MaintenancePage;
	esportsPage: EsportsPage;
	slotsBattlePage: SlotsBattlePage;
	blogCategoryPage: BlogCategoryPage;
	blogPage: BlogPage;
	blogPostPage: BlogPostPage;
	helpPage: HelpPage;
	casinoPage: CasinoPage;
	providersPage: ProvidersPage;
	kothPage: KothPage;
	transactionsPage: TransactionsPage;
	promotionsPage: PromotionsPage;
	promotionPage: PromotionPage;
	notificationsPage: NotificationsPage;
	privacyPage: PrivacyPage;
	sportsPage: SportsPage;
};

export const gamdomPagesFixtures = base.extend<GamdomPages>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	homePage: sessionAwarePage(HomePage),
	affiliatesPage: sessionAwarePage(AffiliatesPage),
	settingsPage: sessionAwarePage(SettingsPage),
	rewardsPage: sessionAwarePage(RewardsPage),
	rewardsExplorePage: sessionAwarePage(RewardsExplorePage),
	profilePage: sessionAwarePage(ProfilePage),
	verificationPage: sessionAwarePage(VerificationPage),
	faqPage: sessionAwarePage(FaqPage),
	geoblockedPage: sessionAwarePage(GeoblockedPage),
	bannedUserPage: sessionAwarePage(BannedUserPage),
	maintenancePage: sessionAwarePage(MaintenancePage),
	esportsPage: sessionAwarePage(EsportsPage),
	slotsBattlePage: sessionAwarePage(SlotsBattlePage),
	blogCategoryPage: sessionAwarePage(BlogCategoryPage),
	helpPage: sessionAwarePage(HelpPage),
	casinoPage: sessionAwarePage(CasinoPage),
	providersPage: sessionAwarePage(ProvidersPage),
	kothPage: sessionAwarePage(KothPage),
	transactionsPage: sessionAwarePage(TransactionsPage),
	blogPage: sessionAwarePage(BlogPage),
	blogPostPage: sessionAwarePage(BlogPostPage),
	statisticsPage: sessionAwarePage(StatisticsPage),
	promotionsPage: sessionAwarePage(PromotionsPage),
	promotionPage: sessionAwarePage(PromotionPage),
	notificationsPage: sessionAwarePage(NotificationsPage),
	privacyPage: sessionAwarePage(PrivacyPage),
	sportsPage: sessionAwarePage(SportsPage),
});
