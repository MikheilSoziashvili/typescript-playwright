import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { whiteSpacePattern } from "@support/regex-patterns";

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

	public get walletButton(): Locator {
		return this.page.locator("button", {
			hasText: "Wallet",
		});
	}

	public get bannerCarousel(): Locator {
		return this.page.locator(
			`div[class*="swiper-initialized swiper-horizontal sc-"]`,
		);
	}

	public get bannerCarouselActiveSlide(): Locator {
		return this.bannerCarousel.locator(
			`div[class*="swiper-slide swiper-slide-active"]`,
		);
	}

	public getBannerCarouselSlideByName(
		slideName: HomePageBannerCarouselSlideTitle,
	): Locator {
		return this.bannerCarousel
			.locator(`div[class*="swiper-slide"]`)
			.filter({
				has: this.page.locator(`img[alt="${slideName}"]`),
			});
	}

	public getSlideNavigateButton(
		slideName: HomePageBannerCarouselSlideTitle,
	): Locator {
		return this.getBannerCarouselSlideByName(slideName).locator(
			"button[class*=ArrowButton]",
		);
	}

	public get topBannerLocator(): Locator {
		return this.page.locator("div[class*=Components-styled__Container]");
	}

	public get topBannerCloseButton(): Locator {
		return this.topBannerLocator.locator("button:has(i.icon-remove)");
	}

	public get topBannerSignupButton(): Locator {
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

	public get casinoMenuLocator(): Locator {
		return this.page.locator(
			'[class*="MuiTypography-navbarMainBold"]:has-text("Casino")',
		);
	}

	public get nextPageButton(): Locator {
		return this.page.locator(
			'button[alt="right"], button:has(img[alt="right"])',
		);
	}

	public providerInCasinoMenu(providerName: string): Locator {
		return this.navbarContainer.locator(
			`//button[normalize-space()='${providerName}']`,
		);
	}

	public get navbarContainer(): Locator {
		return this.page.locator(
			"//div[contains(@class,'NavbarMenu')]//p[text()='Providers']//parent::div[contains(@class,'MuiBox-root')]/..",
		);
	}

	public get providersBelt(): Locator {
		return this.page.locator(
			"//p[text()='Providers']//parent::button//parent::a//parent::div//following-sibling::div[contains(@class,'swiper')]//div[contains(@class,'swiper-wrapper')]",
		);
	}

	public providerOptionInProvidersBelt(providerName: string): Locator {
		const formattedProvider = providerName.replace(whiteSpacePattern, "-");
		return this.page.locator(
			`//a[@href="/providers/${formattedProvider}"]/parent::div[contains(@class, "swiper")]`,
		);
	}

	public get casinoGamesSliderContainer(): Locator {
		return this.page.locator(
			`div[class*='CasinoGamesSlider-styled__Section-sc-']`,
		);
	}

	public casinoGamesSliderByName(games: string): Locator {
		return this.casinoGamesSliderContainer.locator(`p`, {
			hasText: `${games}`,
		});
	}

	public casinoGamesSliderVisitButtonByName(buttonName: string): Locator {
		return this.casinoGamesSliderContainer.locator(`button`, {
			hasText: `${buttonName}`,
		});
	}

	public get kothHeaderImageLocator(): Locator {
		return this.page.locator("header a[href^='/koth'] img");
	}

	public get firstKothHeaderCurrencyAmount(): Locator {
		return this.page
			.locator(
				'div[class*="swiper-slide"] span[class*="currency-amount"]',
			)
			.first();
	}
}
