import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class HomePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get toastMessage(): Locator {
		return this.page.getByTestId("toastContainer");
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
		return this.topBannerLocator.getByTestId("banners-login-signup-button");
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
		return this.page.locator(
			"header a[href='/koth'] div[class*='KothSlider-styled__AnimatedMessage']",
		);
	}

	public get firstKothHeaderCurrencyAmount(): Locator {
		return this.allKothHeaderCurrencyAmounts.first();
	}

	public get allKothHeaderCurrencyAmounts(): Locator {
		return this.page.locator(
			'div[class*="KothSlider-styled__AnimatedMessage-sc-"] svg text:last-of-type',
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

public get gamdomLogoButton(): Locator {
		return this.page.locator("a[class*='TopNavDesktopLogo-']");
	}

	public get originalsNavButton(): Locator {
		return this.page.getByTestId("nav-desktop-Gamdom-Originals-tab");
	}

	public get originalsSubNavContainer(): Locator {
		return this.page
			.getByRole("banner")
			.getByTestId("games-list-slider");
	}

	public get originalsSubNavSwiper(): Locator {
		return this.originalsSubNavContainer.getByTestId(
			"games-list-slider-content-swiper",
		);
	}

	public originalsGameFromSubNav(game: string): Locator {
		return this.originalsSubNavSwiper
			.locator(
				'a[data-testid^="games-list-item-"][data-testid*="-container-"]',
			)
			.filter({
				has: this.page.locator(
					`img[data-testid$="-banner-image"][alt="${game}"]`,
				),
			})
			.first();
	}

	public get originalsSubNavNextButton(): Locator {
		return this.originalsSubNavContainer.getByTestId(
			"games-list-slider-slider-next",
		);
	}

	public get originalsSectionSliderContainer(): Locator {
		return this.page
			.locator("main")
			.getByTestId("games-list-slider")
			.filter({
				has: this.page
					.getByTestId("games-list-slider-header")
					.locator("p", { hasText: "Gamdom Originals" }),
			});
	}

	public get originalsGamesListSliderSwiper(): Locator {
		return this.originalsSectionSliderContainer.getByTestId(
			"games-list-slider-content-swiper",
		);
	}

	public originalsGameFromSection(game: string): Locator {
		return this.originalsGamesListSliderSwiper
			.locator(
				`a[data-testid^="games-list-item-"][data-testid*="-container-${game.toLowerCase()}-"]`,
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

	public get chatButton(): Locator {
		return this.page.getByTestId("chat-toggle-btn");
	}
}
