import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { whiteSpacePattern } from "@support/regex-patterns";

export class HomePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get toastMessage(): Locator {
		return this.page.locator("*[role='alert']");
	}

	public get registerSuccessMessage(): Locator {
		return this.page.locator("p[type='success']");
	}

	public get welcomeBackMessage(): Locator {
		return this.page.locator(
			"[class*='Welcome-styled__WelcomeText'] + span",
		);
	}

	public get bannerCarousel(): Locator {
		return this.page.locator("div.swiper.swiper-backface-hidden");
	}

	public get bannerCarouselActiveSlide(): Locator {
		return this.bannerCarousel.locator("div.swiper-slide-active");
	}

	public getBannerCarouselSlideByName(
		slideName: HomePageBannerCarouselSlideTitle,
	): Locator {
		return this.bannerCarousel.locator(
			`div.swiper-slide:has(img[alt="${slideName}"])`,
		);
	}

	public getSlideNavigateButton(
		slideName: HomePageBannerCarouselSlideTitle,
	): Locator {
		return this.getBannerCarouselSlideByName(slideName).locator(
			"button[class*=ArrowButton]",
		);
	}

	public get topBannerLocator(): Locator {
		return this.page.locator("div[class*=TopBanner-styled__Container]");
	}

	public get topBannerCloseButton(): Locator {
		return this.topBannerLocator.locator("button:has(i.icon-remove)");
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
		return this.providersBelt.locator(
			`a[href="/providers/${formattedProvider}"]`,
		);
	}
}
