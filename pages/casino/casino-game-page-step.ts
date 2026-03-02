import { OriginalGames, VisibilityResult } from "@core/types/types";
import { waitForSeconds, waitUntil } from "@core/utils/utils";
import { CasinoGameName } from "@enums/casino-game";
import { GameProvider } from "@enums/game-providers";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { BasePageStep } from "@pages/base/base-page-step";
import { Locator } from "@playwright/test";
import { step } from "decorators/step";
import { CasinoPage } from "./casino-game-page";

export class CasinoPageSteps extends BasePageStep<CasinoPage> {
	public constructor(gamdomPage: CasinoPage) {
		super(gamdomPage);
	}

	@step(
		`Navigating to home page and checking provider visibility based on configuration`,
	)
	public async verifyProviderOptionStateInBelt(
		casinoPage: CasinoPage,
		providerName: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await casinoPage.navigateAndCheckTitle();

		await waitUntil(
			async () => {
				await casinoPage.refresh();
				try {
					await casinoPage
						.assertThat()
						.verifyProviderOptionStateInBelt(
							providerName,
							expectedResult,
						);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${providerName} was not ${expectedResult} in the belt on the home page in time`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}

	@step("Verify provider displayed in settings modal dropdown")
	public async verifyProviderDisplayedInSettingsModalDropdown(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await this.gamdomPage.clickSettingsButton();
				await this.gamdomPage.clickProvidersDropdownInSettingsModal();
				try {
					await this.gamdomPage
						.assertThat()
						.verifyOptionState(provider, expectedResult);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${provider} was not ${expectedResult} in the settings modal dropdown in time`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}

	@step("Open Favorites and check if game has been added")
	public async openFavoritesAndCheckIfGameHasBeenAdded(
		game: OriginalGames | CasinoGameName | string,
	): Promise<void> {
		await this.gamdomPage.openFavoritesTab();
		await this.gamdomPage.assertThat().gameIsAddedToFavorites(game);
	}

	@step("Search for a casino game and open it")
	public async searchForGameAndOpen(game: CasinoGameName): Promise<void> {
		await this.gamdomPage.searchForGame(game);
		await this.gamdomPage.openGameFromDropdown(game);
	}

	@step("Search for a casino game and open it with retries")
	public async searchForGameAndOpenWithRetries(
		game: CasinoGameName,
		maxRetries = 3,
	): Promise<void> {
		await waitUntil(
			async () => {
				const initialUrl = this.gamdomPage.page.url();

				await this.gamdomPage.searchForGame(game);
				await this.gamdomPage.openGameFromDropdown(game);
				await waitForSeconds(1);

				const currentUrl = this.gamdomPage.page.url();

				if (currentUrl !== initialUrl) {
					return true;
				}
				await this.gamdomPage.refresh();
				return false;
			},
			{
				errorMessage: `Failed to open game ${game} after ${maxRetries} retries`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}

	@step("Select multiple providers from dropdown")
	public async selectMultipleProvidersFromDropdown(
		providers: GameProvider[],
	): Promise<void> {
		await this.gamdomPage.clickProvidersDropdown();
		for (const provider of providers) {
			await this.selectProviderFromDropdown(provider);
		}
	}

	@step("Select provider from dropdown")
	public async selectProviderFromDropdown(
		provider: GameProvider,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerDropdownOption(provider);
		await this.gamdomPage.map.checkboxSelection(providerOption, true);
	}

	@step("Deselect multiple providers from dropdown")
	public async deselectMultipleProvidersFromDropdown(
		providers: GameProvider[],
	): Promise<void> {
		await this.gamdomPage.clickProvidersDropdown();
		for (const provider of providers) {
			await this.deselectProviderFromDropdown(provider);
		}
	}

	@step("Deselect provider from dropdown")
	public async deselectProviderFromDropdown(
		provider: GameProvider,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerDropdownOption(provider);
		await this.gamdomPage.map.checkboxSelection(providerOption, false);
	}

	@step("Select multiple providers from settings modal dropdown")
	public async selectMultipleProvidersFromSettingsModalDropdown(
		providers: GameProvider[],
	): Promise<void> {
		await this.gamdomPage.clickProvidersDropdownInSettingsModal();
		for (const provider of providers) {
			await this.selectProviderFromDropdown(provider);
		}
		await this.gamdomPage.map.providersDropdownInSettingsModal
			// eslint-disable-next-line playwright/no-force-option -- The page overlay covers the header in CI and intercepts pointer events; force is required to reliably close the dropdown.
			.click({ force: true });
	}

	@step("Configure random game settings")
	public async configureRandomGameSettings({
		providers = [],
		showOnlyBonusBuy = false,
		disableLiveGames = false,
		disableTableGames = false,
	}: {
		providers: GameProvider[];
		showOnlyBonusBuy?: boolean;
		disableLiveGames?: boolean;
		disableTableGames?: boolean;
	}): Promise<void> {
		await this.gamdomPage.clickSettingsButton();

		await this.toggleSetting(
			this.gamdomPage.map.showOnlyBonusBuyGamesToggle,
			showOnlyBonusBuy,
		);
		await this.toggleSetting(
			this.gamdomPage.map.disableLiveGamesToggle,
			disableLiveGames,
		);
		await this.toggleSetting(
			this.gamdomPage.map.disableTableGamesToggle,
			disableTableGames,
		);

		await this.selectMultipleProvidersFromSettingsModalDropdown(providers);
		await this.gamdomPage.clickSaveSettingsRandomButton();
	}

	@step("Toggle a setting")
	public async toggleSetting(
		toggle: Locator,
		enable: boolean,
	): Promise<void> {
		await this.gamdomPage.map.toggleState(toggle, enable);
	}
}
