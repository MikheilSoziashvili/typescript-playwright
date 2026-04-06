import { test as base } from "@playwright/test";
import { BrowserSessionManager, sessionAwarePage } from "@core/browser-session-mngmt";
import { ComponentManagementPage } from "@pages/cms/component-management/component-management-cms-page";
import { WelcomeBannerPage } from "@pages/cms/component-management/home/welcome-banner/welcome-banner-cms-page";
import { HomeCarouselPage } from "@pages/cms/component-management/home/carousel/carousel-cms-page";
import { CasinoSportsBannersPage } from "@pages/cms/component-management/home/casino-sports/casino-sports-cms-page";
import { GameCategoriesPage } from "@pages/cms/component-management/casino/game-categories/game-categories-cms-page";
import { ThematicCarouselPage } from "@pages/cms/component-management/casino/thematic-carousel/thematic-carousel-cms-page";
import { CasinoCarouselPage } from "@pages/cms/component-management/casino/casino-carousel/casino-carousel-cms-page";
import { CmsSportsPage } from "@pages/cms/component-management/sports/sports-cms-page";
import { ProvidersCarouselPage } from "@pages/cms/component-management/providers/providers-carousel/providers-carousel-cms-page";
import { ProvidersSliderPage } from "@pages/cms/component-management/providers/providers-slider/providers-slider-cms-page";

export type CmsPages = {
	browserSessionManager: BrowserSessionManager;
	componentManagementCmsPage: ComponentManagementPage;
	welcomeBannerCmsPage: WelcomeBannerPage;
	homeCarouselCmsPage: HomeCarouselPage;
	casinoSportsBannersCmsPage: CasinoSportsBannersPage;
	gameCategoriesCmsPage: GameCategoriesPage;
	thematicCarouselCmsPage: ThematicCarouselPage;
	casinoCarouselCmsPage: CasinoCarouselPage;
	sportsCmsPage: CmsSportsPage;
	providersCarouselCmsPage: ProvidersCarouselPage;
	providersSliderCmsPage: ProvidersSliderPage;
};

export const cmsPagesFixtures = base.extend<CmsPages>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	componentManagementCmsPage: sessionAwarePage(ComponentManagementPage),
	welcomeBannerCmsPage: sessionAwarePage(WelcomeBannerPage),
	homeCarouselCmsPage: sessionAwarePage(HomeCarouselPage),
	casinoSportsBannersCmsPage: sessionAwarePage(CasinoSportsBannersPage),
	gameCategoriesCmsPage: sessionAwarePage(GameCategoriesPage),
	thematicCarouselCmsPage: sessionAwarePage(ThematicCarouselPage),
	casinoCarouselCmsPage: sessionAwarePage(CasinoCarouselPage),
	sportsCmsPage: sessionAwarePage(CmsSportsPage),
	providersCarouselCmsPage: sessionAwarePage(ProvidersCarouselPage),
	providersSliderCmsPage: sessionAwarePage(ProvidersSliderPage),
});
