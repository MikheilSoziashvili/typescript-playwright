import { BasePage } from "@base/base-page";
import { HOME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";
import { LoginModal } from "@modals/login-modal/login-modal";
import { RegisterModal } from "@modals/register-modal/register-modal";
import { Page } from "@playwright/test";
import { HomePageAsserter } from "./home-page-asserter";
import { HomePageMap } from "./home-page-map";
import { HomePageSteps } from "./home-page-steps";
import { waitForSeconds } from "@core/utils/utils";
import { WaitUntilState } from "@enums/wait-until-states";
import { step } from "decorators/step";
import { BoundingBoxCoordinate } from "@enums/bounding-box-coordinates";

export class HomePage extends BasePage<HomePageMap> {
	public constructor(page: Page) {
		super(page, new HomePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [HOME_PAGE_ENDPOINT] },
		});
	}

	// use this method for proxy servers where retries are needed
	@step("Try navigate with retries")
	public async tryNavigate(options?: { retries?: number }): Promise<void> {
		const maxRetries = options?.retries || 3;
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				await this.page.goto(HOME_PAGE_ENDPOINT, {
					timeout: Timeout.EXTRA_LONG,
				});
				return;
			} catch (error) {
				if (error instanceof Error) {
					console.error(
						`Attempt ${attempt} failed: ${error.message}`,
					);
					if (attempt === maxRetries) {
						throw error;
					}
				}
			}
		}
		await this.page.waitForLoadState(WaitUntilState.LOAD, {
			timeout: Timeout.EXTRA_LONG,
		});
	}

	public override assertThat(fromCsv = false): HomePageAsserter {
		return new HomePageAsserter(this, fromCsv);
	}

	public steps(): HomePageSteps {
		return new HomePageSteps(this);
	}

	@step("Navigate and check title")
	public async navigateAndCheckTitle(): Promise<void> {
		await this.navigate();
		await this.assertThat().titleHasText(
			"Gamdom - Top Bitcoin & Crypto Casino!",
		);
	}

	public get loginModal(): LoginModal {
		return new LoginModal(this.page);
	}

	public get registerModal(): RegisterModal {
		return new RegisterModal(this.page);
	}

	@step("Wait carousel slide to be active")
	public async waitCarouselSlideToBeActive(
		slideName: HomePageBannerCarouselSlideTitle,
		timeout = Timeout.LONG,
	): Promise<void> {
		const timeBetweenIterations = 500;
		let isSlideActive = false;

		while (timeout > 0 && isSlideActive === false) {
			const slideLocator =
				this.map.getBannerCarouselSlideByName(slideName);
			const slideClassAttribute = await slideLocator.getAttribute(
				Attributes.CLASS,
			);
			if (slideClassAttribute?.includes("swiper-slide-active")) {
				isSlideActive = true;
			}
			// wait between iteration, not need to use this function each second
			await waitForSeconds(timeBetweenIterations / 1000);
			timeout = timeout - timeBetweenIterations;
		}

		if (!isSlideActive) {
			throw new Error(
				`Slide ${slideName} was not active in the given time interval`,
			);
		}
	}

	@step("Click carousel slide")
	public async clickCarouselSlide(
		slideName: HomePageBannerCarouselSlideTitle,
	): Promise<void> {
		await this.map.getSlideNavigateButton(slideName).click();
	}

	@step("Click wallet button")
	public async clickWalletButton(): Promise<void> {
		await this.map.walletButton.click();
	}

	@step("Hover on wallet button")
	public async hoverOnWalletButton(): Promise<void> {
		await this.map.walletButton.hover();
	}

	@step("Click carousel active slide")
	public async clickCarouselActiveSlide(): Promise<void> {
		await this.map.bannerCarouselActiveSlide.click();
	}

	@step("Close top banner")
	public async closeTopBanner(): Promise<void> {
		await this.map.topBannerCloseButton.click();
		await this.map.waitFor({
			locator: this.map.topBannerLocator,
			state: VisibilityState.HIDDEN,
		});
	}

	@step("Click on casino header button")
	public async clickOnCasinoHeaderButton(): Promise<void> {
		await this.authenticatedHeader.map.casinoNavigationButton.click();
	}

	@step("Click on casino games slider visit button")
	public async clickOnCasinoGamesSliderVisitButton(
		buttonName: string,
	): Promise<void> {
		await this.map.casinoGamesSliderVisitButtonByName(buttonName).click();
	}

	@step("Navigate to wallet")
	public async navigateToWallet(): Promise<void> {
		await this.navigate();
		await this.page.waitForLoadState();
		await this.clickWalletButton();
	}

	@step("Get koth currency xposition")
	public async getKothCurrencyXPosition(): Promise<number> {
		await this.map.waitForStableXPosition({
			locator: this.map.firstKothHeaderCurrencyAmount,
		});
		return this.getElementPosition(
			this.map.firstKothHeaderCurrencyAmount,
			BoundingBoxCoordinate.X,
		);
	}

	@step("Click koth image")
	public async clickKothImage(): Promise<void> {
		await this.map.kothHeaderImageLocator.click();
	}
}
