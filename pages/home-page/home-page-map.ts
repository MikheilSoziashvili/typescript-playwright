import { BaseMap } from "@base/base-map";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { Locator, Page } from "@playwright/test";

export class HomePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get toastMessage(): Locator {
		return this.page.getByTestId("toastContainer");
	}

	public get registerSuccessMessage(): Locator {
		return this.toastMessage.getByTestId("toastTitle");
	}

	public get welcomeBackMessage(): Locator {
		return this.page.locator(
			"[class*='Welcome-styled__WelcomeText'] + span",
		);
	}

	public get bannerCarousel(): Locator {
		return this.page.getByTestId(
			"home-page-top-banner-slider-content-swiper",
		);
	}

	public get bannerCarouselActiveSlide(): Locator {
		return this.bannerCarousel.locator(
			'div[data-testid^="home-page-top-banner-slider-content-swiper-slide-"].swiper-slide-active',
		);
	}

	public get topBannerLocator(): Locator {
		return this.page.getByTestId("home-page-top-banner-logged-out");
	}

	public get topBannedBanner(): Locator {
		return this.page.locator(
			"div[class*='TopBannerBanned-styled__Container']",
		);
	}

	public get topBannerCloseButton(): Locator {
		return this.topBannerLocator.locator("button:has(i.icon-remove)");
	}

	public get topBannerPlayNowButton(): Locator {
		return this.topBannerLocator.getByTestId("signup-center");
	}

	private getTopBannerButton(index: number): Locator {
		return this.topBannerLocator.locator("button").nth(index);
	}

	public get topBannerSteamLoginButton(): Locator {
		return this.getTopBannerButton(0);
	}

	public get topBannerGoogleLoginButton(): Locator {
		return this.getTopBannerButton(1);
	}

	public get topBannerTelegramLoginButton(): Locator {
		return this.getTopBannerButton(2);
	}

	private casinoGamesSliderContainerByTitle(sectionTitle: string): Locator {
		return this.page.getByTestId("games-list-slider").filter({
			has: this.page
				.getByTestId("games-list-slider-header")
				.locator("p", { hasText: sectionTitle }),
		});
	}

	public casinoGamesSliderByName(sectionName: string): Locator {
		return this.casinoGamesSliderContainerByTitle(sectionName);
	}

	public casinoGamesSliderVisitAllButtonByTitle(
		sectionTitle: string,
	): Locator {
		return this.casinoGamesSliderContainerByTitle(sectionTitle).getByTestId(
			"games-list-slider-view-all",
		);
	}

	public get kothHeaderImageLocator(): Locator {
		return this.page.locator("header a[href^='/koth'] img");
	}

	public get firstKothHeaderCurrencyAmount(): Locator {
		return this.page
			.locator('div[class*="swiper-slide"] span[class*="StyledCoins"]')
			.first();
	}

	public get allKothHeaderCurrencyAmounts(): Locator {
		return this.page.locator(
			'div[class*="swiper-slide"] span[class*="StyledCoins"]',
		);
	}

	public get recentWinsSectionContainer(): Locator {
		return this.page.locator(`div[class*='RecentWins-styled__Container']`);
	}

	public get recentWinsProfitAmount(): Locator {
		return this.page.locator(
			'[class*="RecentWins-styled__Item"] span.currency-amount',
		);
	}

	public get recentWinsSectionList(): Locator {
		return this.recentWinsSectionContainer.locator(
			`div[class*='RecentWins-styled__Content-sc']`,
		);
	}

	public get recentWinsSectionTotalBets(): Locator {
		return this.recentWinsSectionContainer.locator(
			`p[class*='MuiTypography-liveSelection']`,
		);
	}

	public get recentWinsItems(): Locator {
		return this.page.locator("div[class*='RecentWins-styled__Item']");
	}

	public recentWinsUsername(item: Locator): Locator {
		return item.locator("span[class*='UserName']");
	}

	public get gamdomLogoButton(): Locator {
		return this.page.locator("a[class*='TopNavDesktopLogo-']");
	}

	public get originalsNavButton(): Locator {
		return this.page.getByTestId("nav-desktop-Gamdom-Originals-tab");
	}

	public originalsGameFromSubNav(game: string): Locator {
		return this.originalsGamesListSliderSwiper
			.locator(
				'div[data-testid^="games-list-item-"][data-testid*="-container"]',
			)
			.filter({
				has: this.page.locator(
					`img[data-testid$="-banner-image"][alt="${game}"]`,
				),
			})
			.first()
			.locator('span[data-testid$="-play-button"]');
	}

	public get originalsSectionSliderContainer(): Locator {
		return this.page.getByTestId("Originals-styled__Container-sc-");
	}

	public get originalsGamesListSliderSwiper(): Locator {
		return this.page.getByTestId("games-list-slider-content-swiper");
	}

	public originalsGameFromSection(game: string): Locator {
		return this.originalsGamesListSliderSwiper
			.locator(
				`div[data-testid^="games-list-item-"][data-testid*="-container-${game.toLowerCase()}"]`,
			)
			.first();
	}

	public get originalsSliderNextButton(): Locator {
		return this.originalsSectionSliderContainer.getByTestId(
			"games-list-slider-slider-next",
		);
	}

	public get headerContainer(): Locator {
		return this.page.locator(
			'div[class*="MainLayoutV4Container__Container"][class*="HeaderNavPanel"]',
		);
	}

	public topLineHeaderLink(tab: string): Locator {
		return this.headerContainer.locator("span[class*='-navbarSecondary']", {
			hasText: `${tab}`,
		});
	}

	public get walletButton(): Locator {
		return this.page.getByTestId("nav-wallet-action-btn");
	}

	public get liveBetsSectionTotalBets(): Locator {
		return this.page.getByTestId("general-stats-total-bets-container");
	}

	public get liveBetsRows(): Locator {
		return this.page.locator('[data-testid^="general-stats-table-row-"]');
	}

	public liveBetsUsernameCell(row: Locator): Locator {
		return row.locator('[data-testid$="-username"]');
	}
}
