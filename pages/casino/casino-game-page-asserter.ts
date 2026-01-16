import { BaseAsserter } from "@base/base-asserter";
import { CasinoPage } from "./casino-game-page";
import { expect } from "playwright/test";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { VisibilityOptions } from "@enums/visibility-options";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";

export class CasinoPageAsserter extends BaseAsserter<CasinoPage> {
	public constructor(page: CasinoPage) {
		super(page);
	}

	@step("Verify dropdown option visibility")
	private async verifyDropdownOptionVisibility(
		option: GameProvider,
		shouldBeVisible: boolean,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerDropdownOption(option);

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
		await this.gamdomPage.map.waitForAttributeToHaveValue(
			this.gamdomPage.map.casinoGamesScrollbarItemByPlaceholder(tabName),
			Attributes.ARIA_SELECTED,
			BooleanValueString.TRUE,
		);
	}

	@step("Game is added to favorites")
	public async gameIsAddedToFavorites(gameName: string): Promise<void> {
		const gameInFavorites = this.gamdomPage.map.favoritedGamesList.filter({
			hasText: gameName,
		});
		await this.checkElementsAreVisible([gameInFavorites]);
	}

	@step("Self exclusion toast message is displayed")
	public async selfExclusionToastMessageIsDisplayed(): Promise<void> {
		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.FAILED);
		await this.gamdomPage.toast
			.assertThat()
			.subTitleIs(ToastSubTitle.SELF_EXCLUSION);
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

	@step("Self exclusion toast message is displayed - v4")
	public async selfExclusionToastMessageIsDisplayedV4(): Promise<void> {
		await this.gamdomPage.toastV4
			.assertThat()
			.toastMessageIsV4(
				ToastTitle.FAILED_V4,
				ToastSubTitle.SELF_EXCLUSION,
			);
	}
}
