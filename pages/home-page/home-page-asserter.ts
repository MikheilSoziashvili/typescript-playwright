import { Timeout } from "@enums/timeout";
import { BaseAsserter } from "@base/base-asserter";
import { HomePage } from "./home-page";
import { expect, TestInfo } from "@playwright/test";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { VisibilityOptions } from "@enums/visibility-options";
import { step } from "decorators/step";

export class HomePageAsserter extends BaseAsserter<HomePage> {
	public fromCsv: boolean;
	public constructor(page: HomePage, fromCsv = false) {
		super(page);
		this.fromCsv = fromCsv;
	}

	@step()
	public async titleHasText(title: string): Promise<void> {
		await expect(this.gamdomPage.page).toHaveTitle(title, {
			timeout: Timeout.MAX,
		});
	}

	@step()
	public async userIsLoggedIn(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
	}

	@step()
	public async userIsLoggedOut(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisible();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	@step()
	public async toastMessageContainsText(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await expect(this.gamdomPage.map.toastMessage).toContainText(text);
	}

	@step()
	public async userIsRegistered(username: string): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
		await expect
			.soft(this.gamdomPage.map.registerSuccessMessage)
			.toBeVisible();

		const receivedUsername =
			await this.gamdomPage.map.welcomeBackMessage.textContent({
				timeout: Timeout.MAX,
			});

		expect(receivedUsername?.trim()).toBe(`${username}!`);
	}

	@step()
	public async isBannerCarouselDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.bannerCarousel).toBeVisible();
	}

	@step()
	public async isTopBannerDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.topBannerLocator).toBeVisible();
	}

	@step()
	public async isCasinoGameSliderDisplayed(
		casinoGameSlider: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.casinoGamesSliderByName(casinoGameSlider),
		).toBeVisible();
	}

	@step()
	public async topBannerVisualCorrect(testInfo: TestInfo): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.topBannerLocator,
		);
	}

	@step()
	public async verifyProviderState(
		provider: string,
		expectedResult: VisibilityResult,
	): Promise<void> {
		if (expectedResult === VisibilityOptions.VISIBLE) {
			await this.gamdomPage.steps().verifyProviderVisibility(provider);
		} else {
			await this.gamdomPage.steps().verifyProviderInvisibility(provider);
		}
	}

	@step()
	public async verifyProviderOptionDisplayedInBelt(
		option: GameProvider,
		shouldBeVisible: boolean,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerOptionInProvidersBelt(option);

		shouldBeVisible
			? await expect(providerOption).toBeVisible()
			: await expect(providerOption).toBeHidden();
	}

	@step()
	public async verifyProviderOptionStateInBelt(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		const shouldBeVisible = expectedResult === VisibilityOptions.VISIBLE;
		await this.verifyProviderOptionDisplayedInBelt(
			provider,
			shouldBeVisible,
		);
	}
}
