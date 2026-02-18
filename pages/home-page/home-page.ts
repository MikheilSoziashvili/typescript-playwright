import { BasePage } from "@base/base-page";
import { HOME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { Timeout } from "@enums/timeout";
import { LoginModal } from "@modals/login-modal/login-modal";
import { RegisterModal } from "@modals/register-modal/register-modal";
import { Page } from "@playwright/test";
import { HomePageAsserter } from "./home-page-asserter";
import { HomePageMap } from "./home-page-map";
import { HomePageSteps } from "./home-page-steps";
import { WaitUntilState } from "@enums/wait-until-states";
import { step } from "decorators/step";
import { BoundingBoxCoordinate } from "@enums/bounding-box-coordinates";
import { Notification } from "@pages/components/notification/notification";
import { Toast } from "@pages/components/toast/toast";

export class HomePage extends BasePage<HomePageMap> {
	private readonly notification: Notification;
	public readonly toast: Toast;

	constructor(page: Page) {
		super(page, new HomePageMap(page));
		this.notification = new Notification(page);
		this.toast = new Toast(page);
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
		srcPartial: string,
		timeout = Timeout.EXTRA_LONG,
	): Promise<void> {
		const activeSlide = this.map.bannerCarouselActiveSlide
			.filter({
				has: this.page.locator('div[data-testid$="-title"]', {
					hasText: slideName,
				}),
			})
			.filter({
				has: this.page.locator(`img[src*="${srcPartial}"]`),
			});

		await this.assertThat().checkElementsAreVisible([activeSlide], timeout);
	}

	@step("Click carousel slide")
	public async clickCarouselSlide(
		slideName: HomePageBannerCarouselSlideTitle,
		srcPartial: string,
	): Promise<void> {
		await this.waitCarouselSlideToBeActive(slideName, srcPartial);
		await this.map.bannerCarouselActiveSlide.click();
	}

	@step("Click wallet button")
	public async clickWalletButton(): Promise<void> {
		await this.map.walletButton.click();
	}

	@step("Hover on wallet button")
	public async hoverOnWalletButton(): Promise<void> {
		await this.map.walletButton.hover();
	}

	@step("Hover on originals nav button")
	public async hoverOnOriginalsNavButton(): Promise<void> {
		await this.map.originalsNavButton.hover();
	}

	@step("Click carousel active slide")
	public async clickCarouselActiveSlide(): Promise<void> {
		await this.map.bannerCarouselActiveSlide.click();
	}

	@step("Click on casino header button")
	public async clickOnCasinoHeaderButton(): Promise<void> {
		await this.authenticatedHeader.map.casinoNavigationButton.click();
	}

	@step("Click on casino games slider view all")
	public async clickOnCasinoGamesSliderVisitButton(
		sectionTitle: string,
	): Promise<void> {
		await this.map
			.casinoGamesSliderVisitAllButtonByTitle(sectionTitle)
			.click();
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

	@step("Click gamdom logo")
	public async clickGamdomLogo(): Promise<void> {
		await this.map.gamdomLogoButton.click();
		await this.page.waitForLoadState(WaitUntilState.LOAD);
	}

	@step("Click on top line header link")
	public async clickOnTopLineHeaderLink(tab: string): Promise<void> {
		await this.map.topLineHeaderLink(tab).click();
	}

	@step("Click play button")
	public async clickPlayFromFreeSpinsNotification(): Promise<void> {
		await this.notification.aknowledge();
	}

	public getNotification(): Notification {
		return this.notification;
	}

	@step("Navigate and expand chat")
	public async navigateAndExpandChat(): Promise<void> {
		await this.navigate();
		await this.authenticatedHeader.expandChatIfNotVisible();
	}
}
