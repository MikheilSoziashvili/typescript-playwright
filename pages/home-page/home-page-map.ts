import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";

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
}
