import { CASINO_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { step } from "decorators/step";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { CasinoPageMap } from "./casino-game-page-map";
import { CasinoPageAsserter } from "./casino-game-page-asserter";
import { CasinoPageSteps } from "./casino-game-page-step";
import { CasinoGameName } from "@enums/casino-game";
import { Toast } from "@pages/components/toast/toast";
import { ToastV4 } from "@pages/components/toastV4/toast-v4";

export class CasinoPage extends BasePage<CasinoPageMap> {
	public readonly toast: Toast;
	public readonly toastV4: ToastV4;
	public constructor(page: Page) {
		super(page, new CasinoPageMap(page));
		this.toast = new Toast(page);
		this.toastV4 = new ToastV4(page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CASINO_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): CasinoPageAsserter {
		return new CasinoPageAsserter(this);
	}

	public steps(): CasinoPageSteps {
		return new CasinoPageSteps(this);
	}

	@step("Navigate and check title")
	public async navigateAndCheckTitle(): Promise<void> {
		await this.navigate();
		await this.assertThat().titleHasText(
			"Casino Games Online - Play Slots, Table & Live Games",
		);
	}

	@step("Click providers dropdown")
	public async clickProvidersDropdown(): Promise<void> {
		await this.map.providersDropdown.click();
	}

	@step("Click settings button")
	public async clickSettingsButton(): Promise<void> {
		await this.map.settingsButton.click();
	}

	@step("Click providers dropdown in settings modal")
	public async clickProvidersDropdownInSettingsModal(): Promise<void> {
		await this.map.providersDropdownInSettingsModal.click();
	}

	@step("Get the name of the first new game")
	public async getFirstNewGameName(): Promise<string> {
		return this.map.firstGameInSlider.locator("p").first().innerText();
	}

	@step("Get the name of the second Top game")
	public async getSecondTopGameName(): Promise<string> {
		await this.map.topGamesSlider.scrollIntoViewIfNeeded();
		return this.map.secondTopGame().locator("p").first().innerText();
	}

	@step("Add first new game to favorites")
	public async addFirstNewGameToFavorites(): Promise<void> {
		await this.map.sliderHeartIcon.click();
	}

	@step("Search for a game")
	public async searchForGame(gameName: string): Promise<void> {
		await this.map.searchInputField.click();
		await this.map.searchInputField.fill(gameName);
	}

	@step("Add game from dropdown to favorites")
	public async addGameFromDropdownToFavorites(
		game: CasinoGameName,
	): Promise<void> {
		await this.map.dropdownHeartIcon(game).click();
		await this.map.titleImage.click();
	}

	@step("Open favorites tab")
	public async openFavoritesTab(): Promise<void> {
		await this.map.favoritesTab.click();
	}

	@step("Open game from dropdown")
	public async openGameFromDropdown(game: CasinoGameName): Promise<void> {
		await this.map.casinoGameInDropdown(game).click();
	}

	@step("click in-game heart icon")
	public async clickInGameHeartIcon(): Promise<void> {
		await this.map.inGameHeartIcon.click();
	}

	@step("Double click Save Settings button")
	public async clickSaveSettingsRandomButton(): Promise<void> {
		const button = this.map.saveSettingsRandomButton;

		await button.evaluate((element) => {
			const btn = element as HTMLElement;
			btn.click();
			btn.click();
		});
	}

	@step("Click Pick random button")
	public async clickPickRandomButton(): Promise<void> {
		await this.map.pickRandomButton.click();
	}

	@step("Search for a game - v4")
	public async searchForGameV4(gameName: string): Promise<void> {
		await this.map.searchInputFieldV4.click();
		await this.map.searchQuickSearchInputFieldV4.click();
		await this.map.searchInputFieldV4.fill(gameName);
	}

	@step("Open game from dropdown - v4")
	public async openGameFromDropdownV4(game: CasinoGameName): Promise<void> {
		await this.map.casinoGameInDropdownV4(game).click();
	}
}
