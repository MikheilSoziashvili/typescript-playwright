import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { GameProvider } from "@enums/game-providers";
import { CasinoGameName } from "@enums/casino-game";
import { whiteSpacePattern } from "@support/regex-patterns";

export class CasinoPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get providersBelt(): Locator {
		return this.page
			.getByTestId("lobby-providers-section")
			.locator(".swiper-wrapper");
	}

	public providerOptionInProvidersBelt(providerName: string): Locator {
		const formattedProvider = providerName.replace(whiteSpacePattern, "-");
		return this.providersBelt.locator(
			`a[href='/casino/providers/${formattedProvider}']`,
		);
	}

	public providerDropdownOption(gameProvider: GameProvider): Locator {
		return this.page.locator(
			`ul[class*='MuiMenu-list'] > li[data-value='${gameProvider}']`,
		);
	}

	public get providersDropdown(): Locator {
		return this.getSpanByClassContains("Dropdown-styled");
	}

	public get settingsButton(): Locator {
		return this.page.getByTestId(
			"casino-layout-pick-random-desktop-settings-btn-pick-random-game-casino",
		);
	}

	public get providersDropdownInSettingsModal(): Locator {
		return this.page.getByTestId(
			"pick-random-modal-providers-selector-button",
		);
	}

	public get providersDropdownListboxInSettingsModal(): Locator {
		return this.page.getByRole("listbox");
	}

	public providerOptionInProvidersDropdown(providerName: string): Locator {
		return this.providersDropdownListboxInSettingsModal.locator(
			"div[role='option']",
			{ hasText: providerName },
		);
	}

	public get casinoGamesScrollbarContainer(): Locator {
		return this.page.locator(`div[role="tablist"]`);
	}

	public casinoGamesScrollbarItemByPlaceholder(
		scrollbarItem: string,
	): Locator {
		return this.casinoGamesScrollbarContainer.locator(`a[role='tab']`, {
			hasText: `${scrollbarItem}`,
		});
	}

	public get titleImage(): Locator {
		return this.page.locator("div[class*='Head-styled__HeadImageBox']");
	}

	public get searchInputContainer(): Locator {
		return this.page.getByTestId("external-games-search-field-container");
	}

	public get searchInputField(): Locator {
		return this.page.getByTestId("external-games-search-field-input");
	}

	public get searchQuickSearchInputField(): Locator {
		return this.page.getByTestId("search-input-input");
	}

	public casinoGameDropdownItem(game: CasinoGameName): Locator {
		return this.page
			.locator("li")
			.filter({
				has: this.page.locator(
					"div[class*='DropdownItem-styled__OptionDetails']",
					{
						hasText: game,
					},
				),
			})
			.filter({
				has: this.page.locator(
					"div[class*='DropdownItem-styled__OptionDesc']",
					{
						hasText: "Wicked Games",
					},
				),
			});
	}

	public casinoGameInDropdown(game: CasinoGameName): Locator {
		return this.page
			.locator(
				'[data-testid^="quick-search-carousel-item-"][data-testid$="-container"]',
			)
			.filter({
				has: this.page.locator(`img[alt="${game}"]`),
			})
			.first();
	}

	public quickSearchCarouselItemByIndex(index: number): Locator {
		return this.page.getByTestId(
			`quick-search-carousel-item-${index}-container`,
		);
	}

	public quickSearchCarouselItemLikeButtonByIndex(index: number): Locator {
		return this.page.getByTestId(
			`quick-search-carousel-item-${index}-like-button`,
		);
	}

	public dropdownHeartIconByIndex(index: number): Locator {
		return this.quickSearchCarouselItemLikeButtonByIndex(index);
	}

	public get quickSearchCloseButton(): Locator {
		return this.page.getByTestId(
			"close-btn-games-search-modal-header-close",
		);
	}

	public get newGamesSlider(): Locator {
		return this.page.getByTestId("lobby-carousel-content-swiper").filter({
			has: this.page.getByText("New Games", { exact: true }),
		});
	}

	public get topGamesSlider(): Locator {
		return this.page
			.locator("div[class*='Slider-styled__GameSwiperContainer']")
			.filter({
				hasText: "Top Games",
				has: this.page.locator(".swiper-wrapper"),
			});
	}

	public get firstGameInSlider(): Locator {
		return this.newGamesSlider
			.locator('[data-testid^="lobby-carousel-slide-"]')
			.first();
	}

	public get sliderHeartIcon(): Locator {
		return this.firstGameInSlider.locator(
			"div[class*='styled__LikeButton']",
		);
	}

	public secondTopGame(): Locator {
		return this.topGamesSlider.locator(".swiper-slide").nth(1);
	}

	public get casinoTabsContainer(): Locator {
		return this.page.getByTestId("casino-layout-tabs-tablist");
	}

	public casinoTabByName(tabName: string): Locator {
		return this.casinoTabsContainer
			.getByRole("link")
			.filter({ hasText: tabName.trim() });
	}

	public get favoritesTab(): Locator {
		return this.casinoTabByName("Favorites");
	}

	public get favoritedGamesList(): Locator {
		return this.page.locator("div[class*='styled__GameInfoWrapper']");
	}

	public get inGameHeartIcon(): Locator {
		return this.page.getByTestId("game-like-button");
	}

	public get allVisibleGameCards(): Locator {
		return this.page.locator(
			"div[class*='GameCard-styled__GameCardWrapper']",
		);
	}

	public gameCardProviderLabel(gameCard: Locator): Locator {
		return gameCard.locator("p[class*='GameCard-styled__GameProvider']");
	}

	public get saveSettingsRandomButton(): Locator {
		return this.page.getByTestId("saveSettingsRandomButton");
	}

	public get showOnlyBonusBuyGamesToggle(): Locator {
		return this.page.getByTestId("bonusBuyGamesSwitch");
	}

	public get disableLiveGamesToggle(): Locator {
		return this.page.getByTestId("disableLiveGamesSwitch");
	}

	public get disableTableGamesToggle(): Locator {
		return this.page.getByTestId("disableTableGamesSwitch");
	}

	public get pickRandomButton(): Locator {
		return this.page.getByTestId("pickRandomButton");
	}
	public get gameProviderLabel(): Locator {
		return this.page.getByTestId("game-provider");
	}
}
