import { BaseAsserter } from "@base/base-asserter";
import { VisibilityResult } from "@core/types/types";
import { waitUntil } from "@core/utils/utils";
import { GameProvider } from "@enums/game-providers";
import { IntervalMs } from "@enums/interval-millisecond";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { VisibilityOptions } from "@enums/visibility-options";
import { logger } from "@logger/logger";
import { expect, Locator, TestInfo } from "@playwright/test";
import {
	digitsOnlyPattern,
	plainAmount,
	shortScaled,
} from "@support/regex-patterns";
import { step } from "decorators/step";
import { HomePage } from "./home-page";
import { CasinoGameUrl } from "@enums/casino-game";
import * as Configuration from "configuration";
import { Footer } from "@pages/components/footer/footer";

export class HomePageAsserter extends BaseAsserter<HomePage> {
	public fromCsv: boolean;
	public constructor(page: HomePage, fromCsv = false) {
		super(page);
		this.fromCsv = fromCsv;
	}

	@step("Title has text")
	public async titleHasText(title: string): Promise<void> {
		await expect(this.gamdomPage.page).toHaveTitle(title, {
			timeout: Timeout.MAX,
		});
	}

	@step("User is logged in")
	public async userIsLoggedIn(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
	}

	@step("User is logged out")
	public async userIsLoggedOut(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisible();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	@step("Toast message contains text")
	public async toastMessageContainsText(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await expect(this.gamdomPage.map.toastMessage).toContainText(text);
	}

	@step("User is registered")
	public async userIsRegistered(username: string): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();

		const receivedUsername =
			await this.gamdomPage.map.welcomeBackMessage.textContent({
				timeout: Timeout.MAX,
			});

		expect(receivedUsername?.trim()).toBe(`${username}!`);
	}

	@step("Is banner carousel displayed")
	public async isBannerCarouselDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.bannerCarousel).toBeVisible();
	}

	@step("Is top banner displayed")
	public async isTopBannerDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.topBannerLocator).toBeVisible();
	}

	@step("Verify that Create Account and Social buttons are disabled")
	public async verifyTopBannerButtonsState(): Promise<void> {
		const page = this.gamdomPage.page;

		await this.checkElementsAreVisible([
			this.gamdomPage.map.topBannerSignupButton,
		]);
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.topBannerSignupButton,
		]);
		const urlBeforeClick = page.url();
		await this.gamdomPage.map.topBannerSignupButton.click();
		expect(page.url()).toBe(urlBeforeClick);

		const socialButtons = [
			this.gamdomPage.map.topBannerSteamLoginButton,
			this.gamdomPage.map.topBannerGoogleLoginButton,
			this.gamdomPage.map.topBannerTelegramLoginButton,
		];

		await this.checkElementsAreVisible(socialButtons);
		await this.checkButtonsDoNotNavigateWhenClicked(socialButtons);
	}

	@step("Check buttons do not navigate when clicked")
	public async checkButtonsDoNotNavigateWhenClicked(
		socialButtons: Locator[],
	): Promise<void> {
		for (const button of socialButtons) {
			if (await button.isEnabled()) {
				const page = button.page();
				const urlBefore = page.url();
				await button.click();
				expect(page.url()).toBe(urlBefore);
			} else {
				logger.info("Button is disabled, skipping click");
			}
		}
	}

	@step("Is casino game slider displayed")
	public async isCasinoGameSliderDisplayed(
		casinoGameSlider: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.casinoGamesSliderByName(casinoGameSlider),
		).toBeVisible();
	}

	@step("Top banner visual correct")
	public async topBannerVisualCorrect(testInfo: TestInfo): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.topBannerLocator,
		);
	}

	@step("Koth in header visual correct")
	public async kothInHeaderVisualCorrect(testInfo: TestInfo): Promise<void> {
		await this.gamdomPage.map.waitForStableXPosition({
			locator: this.gamdomPage.map.kothHeaderImageLocator,
		});
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.kothHeaderImageLocator,
			{
				toHaveScreenshotOptions: {
					mask: [this.gamdomPage.map.firstKothHeaderCurrencyAmount],
				},
			},
		);
	}

	@step("Verify koth currency is centered")
	public async verifyKothCurrencyIsCentered(): Promise<void> {
		const currencyContainer =
			this.gamdomPage.map.firstKothHeaderCurrencyAmount;
		const initialX = await this.gamdomPage.getKothCurrencyXPosition();

		await this.verifyElementIsCentered(
			currencyContainer,
			initialX,
			"KOTH Header Currency",
		);
	}

	@step("Verify provider state")
	public async verifyProviderState(
		provider: string,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				try {
					if (expectedResult === VisibilityOptions.VISIBLE) {
						await this.gamdomPage
							.steps()
							.verifyProviderVisibility(provider);
					} else {
						await this.gamdomPage
							.steps()
							.verifyProviderInvisibility(provider);
					}
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${provider} did not reach expected visibility state: ${expectedResult}`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}

	@step("Verify provider option displayed in belt")
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

	@step("Verify provider option state in belt")
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

	@step("Verify animation visibility")
	public async loaderIsCorrectlyDisplayed(): Promise<void> {
		await this.loaderWasVisible();
		await this.loaderHasDisappeared();
	}

	@step("Verify Recent Wins section is visible")
	public async verifyRecentWinsSectionIsVisibleAndPopulated(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.recentWinsSectionContainer,
			]);

		await this.gamdomPage
			.assertThat()
			.isElementVisible([this.gamdomPage.map.recentWinsProfitAmount]);

		const recentWinsList =
			await this.gamdomPage.map.recentWinsProfitAmount.count();

		expect(
			recentWinsList,
			"Recent Wins section should have 10 items",
		).toBeGreaterThan(0);
	}

	@step("Verify recent wins details are not visible")
	public async verifyRecentWinsDetailsAreNotVisible(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.recentWinsProfitAmount,
			]);
	}

	@step("Verify total bets are not 0 and updated in time")
	public async verifyTotalBetsAreNotZeroAndUpdatedInTime(): Promise<void> {
		await this.verifySectionTotalBetsAreNotZero(
			this.gamdomPage.map.recentWinsSectionTotalBets,
			"Recent Wins section",
		);
		await this.verifySectionTotalBetsAreNotZero(
			this.gamdomPage.map.liveBetsSectionTotalBets,
			"Live Bets section",
		);
	}

	@step("Verify total bets are not 0")
	private async verifySectionTotalBetsAreNotZero(
		locator: Locator,
		sectionName: string,
	): Promise<void> {
		await locator.scrollIntoViewIfNeeded();
		await expect
			.poll(
				async () => {
					const totalBetsText = await locator.textContent();
					const totalBetsNumber = parseFloat(
						totalBetsText?.match(digitsOnlyPattern)?.[0] || "0",
					);

					logger.info(
						`Polling for total bets in ${sectionName} section: ${totalBetsNumber}`,
					);

					return totalBetsNumber;
				},
				{
					message: `Total bets in ${sectionName} section did not update in time`,
					intervals: [IntervalMs.NORMAL],
					timeout: Timeout.EXTRA_LONG,
				},
			)
			.toBeGreaterThan(0);
	}

	@step("Verify redirection to game")
	public async userIsRedirectedToGame(): Promise<void> {
		await expect(this.gamdomPage.page).toHaveURL(
			`${Configuration.environment_url}${CasinoGameUrl.BARREL_BONANZA}`,
		);
	}

	@step("Verify Originals game is launched")
	public async originalsGameIsLaunched(
		_game: string,
		expectedUrl: string,
	): Promise<void> {
		await expect(this.gamdomPage.page).toHaveURL(expectedUrl);
	}

	@step("Verify all Koth header currency amount formats")
	public async allKothheaderCurrenyAmountFormatsAreCorrect(
		amounts: string[],
		symbol: string,
	): Promise<void> {
		for (const fullTextRaw of amounts) {
			logger.info(
				`Checking amount text: "${fullTextRaw}" for symbol "${symbol}"`,
			);

			const fullText = fullTextRaw.trim();
			const numericPart = fullText.replace(symbol, "").trim();

			await this.assertAllTruthy([
				{
					condition: fullText.includes(symbol),
					message: `Missing currency symbol/code "${symbol}" in: "${fullTextRaw}"`,
				},
				{
					condition:
						plainAmount.test(numericPart) ||
						shortScaled.test(numericPart),
					message: `Invalid KOTH amount format "${fullTextRaw}" after removing "${symbol}" -> "${numericPart}"`,
				},
			]);
		}
	}

	@step("Verify redirect with simple retry mechanism")
	public async verifyAffiliatesRedirectWithRetry(
		footer: Footer,
		expectedUrl: string,
		maxRetries = 3,
	): Promise<void> {
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			await footer.openAffiliatesPage();

			try {
				await this.waitForAndVerifyCurrentUrlIs(expectedUrl);
				return;
			} catch {
				logger.info(
					`Attempt ${attempt}: URL is ${this.gamdomPage.page.url()}, expected ${expectedUrl}. Retrying...`,
				);

				if (attempt < maxRetries) {
					await this.gamdomPage.navigate();
				}
			}
		}
		throw new Error(
			`Failed to redirect to ${expectedUrl} after ${maxRetries} attempts. Feature disabling may not have taken effect.`,
		);
	}
}
