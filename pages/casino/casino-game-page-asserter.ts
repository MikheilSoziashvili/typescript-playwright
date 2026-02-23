import { BaseAsserter } from "@base/base-asserter";
import { CasinoPage } from "./casino-game-page";
import { expect } from "playwright/test";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { VisibilityOptions } from "@enums/visibility-options";
import { step } from "decorators/step";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Timeout } from "@enums/timeout";
import { FavoritesGamesListResponse } from "@dtos/responses/gamdom-api/get-favorites-games-list-response";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";

export class CasinoPageAsserter extends BaseAsserter<CasinoPage> {
	public constructor(page: CasinoPage) {
		super(page);
	}

	@step("Title has text")
	public async titleHasText(title: string): Promise<void> {
		await expect(this.gamdomPage.page).toHaveTitle(title, {
			timeout: Timeout.MAX,
		});
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

	@step("Verify dropdown option visibility")
	private async verifyDropdownOptionVisibility(
		option: GameProvider,
		shouldBeVisible: boolean,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerOptionInProvidersDropdown(option);

		shouldBeVisible
			? await expect(providerOption).toBeVisible()
			: await expect(providerOption).toBeHidden();
	}

	@step("Verify option state")
	public async verifyOptionState(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		const shouldBeVisible = expectedResult === VisibilityOptions.VISIBLE;
		await this.verifyDropdownOptionVisibility(provider, shouldBeVisible);
	}

	@step("Verify that the casino games scrollbar tab is selected")
	public async isCasinoGamesScrollbarTabSelected(
		tabName: string,
	): Promise<void> {
		await this.expectElementToHaveClass(
			this.gamdomPage.map.casinoGamesScrollbarItemByPlaceholder(tabName),
			AttributesValues.ACTIVE,
		);
	}

	@step("Game is added to favorites")
	public async gameIsAddedToFavorites(gameName: string): Promise<void> {
		const gameInFavorites =
			this.gamdomPage.map.favoriteGameTileByName(gameName);

		await this.checkElementsAreVisible([gameInFavorites]);
	}

	@step("Favorite games list contains game")
	public async favoritesGamesListApiContainsGame(
		favoritesGamesList: FavoritesGamesListResponse,
		expectedGameName: string,
	): Promise<void> {
		const games = this.extractFavoriteGameNames(favoritesGamesList);

		const found = games.some((name) => name === expectedGameName);

		if (!found) {
			throw new Error(
				`Expected favorites games-list response to contain "${expectedGameName}", but it didn't.\n` +
					`Received games: ${games.join(", ")}`,
			);
		}
	}

	private extractFavoriteGameNames(
		favoritesGamesList: FavoritesGamesListResponse,
	): string[] {
		return favoritesGamesList.games
			.flatMap((group) => group.gamesList)
			.map((g) => g.staticData.name);
	}

	@step("Self exclusion toast message is displayed")
	public async selfExclusionToastMessageIsDisplayed(): Promise<void> {
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(ToastTitle.FAILED, ToastSubTitle.SELF_EXCLUSION);
	}

	@step("Verify all visible games are from provider(s)")
	public async verifyAllVisibleGamesAreFromProvider(
		providers: GameProvider | GameProvider[],
	): Promise<void> {
		const allowedProviders = Array.isArray(providers)
			? providers
			: [providers];
		const gameCards = await this.gamdomPage.map.allVisibleGameCards.all();

		const providerLabels = gameCards.map((card) =>
			this.gamdomPage.map.gameCardProviderLabel(card),
		);

		await this.checkEachElementTextIsInSet(
			providerLabels,
			allowedProviders,
		);
	}

	@step(
		"Verify that the displayed game provider is one of the expected providers",
	)
	public async verifyGameProviderIsOneOf(
		expectedProviders: GameProvider[],
	): Promise<void> {
		const label = this.gamdomPage.map.gameProviderLabel;
		const text = (await label.textContent())?.trim() ?? "";
		const allowed = expectedProviders.map(String);

		expect(
			allowed.includes(text),
			`Expected displayed provider "${text}" to be one of: ${allowed.join(
				", ",
			)}`,
		).toBeTruthy();
	}
}
