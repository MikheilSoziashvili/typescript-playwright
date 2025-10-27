import { OriginalGames, VisibilityResult } from "@core/types/types";
import { waitUntil } from "@core/utils/utils";
import { CasinoGameName } from "@enums/casino-game";
import { GameProvider } from "@enums/game-providers";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { CasinoPage } from "./casino-game-page";

export class CasinoPageSteps extends BasePageStep<CasinoPage> {
	public constructor(gamdomPage: CasinoPage) {
		super(gamdomPage);
	}

	@step("Verify provider displayed in dropdown")
	public async verifyProviderDisplayedInDropdown(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await this.gamdomPage.clickProvidersDropdown();
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
				errorMessage: `Provider ${provider} was not ${expectedResult} in the dropdown in time`,
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
		await this.gamdomPage.map.toggleCheckboxSelection(providerOption, true);
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
		await this.gamdomPage.map.toggleCheckboxSelection(
			providerOption,
			false,
		);
	}
}
