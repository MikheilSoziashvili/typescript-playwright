import { Timeout } from "@enums/timeout";
import { BaseAsserter } from "@base/base-asserter";
import { HomePage } from "./home-page";
import { expect, TestInfo } from "@playwright/test";

export class HomePageAsserter extends BaseAsserter<HomePage> {
	public fromCsv: boolean;
	public constructor(page: HomePage, fromCsv = false) {
		super(page);
		this.fromCsv = fromCsv;
	}

	public async titleHasText(title: string): Promise<void> {
		await expect(this.gamdomPage.page).toHaveTitle(title, {
			timeout: Timeout.MAX,
		});
	}

	public async userIsLoggedIn(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
	}

	public async userIsLoggedOut(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisible();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	public async toastMessageContainsText(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await expect(this.gamdomPage.map.toastMessage).toContainText(text);
	}

	public async userIsRegistered(username: string): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
		await expect(this.gamdomPage.map.registerSuccessMessage).toBeVisible();

		const receivedUsername =
			await this.gamdomPage.map.welcomeBackMessage.textContent({
				timeout: Timeout.MAX,
			});

		expect(receivedUsername?.trim()).toBe(`${username}!`);
	}

	public async isBannerCarouselDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.bannerCarousel).toBeVisible();
	}

	public async isTopBannerDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.topBannerLocator).toBeVisible();
	}

	public async topBannerVisualCorrect(testInfo: TestInfo): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.topBannerLocator,
		);
	}
}
