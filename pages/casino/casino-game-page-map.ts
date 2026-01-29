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

	public get searchInputField(): Locator {
		return this.page
			.getByTestId("searchInputFieldContainer")
			.locator("input")
			.first();
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
			.locator("li[class*='DropdownItem-styled__List']")
			.filter({
				has: this.page.locator(
					"div[class*='DropdownItem-styled__OptionTitle']",
					{
						hasText: new RegExp(`^${game}$`),
					},
				),
			})
			.first();
	}

	public dropdownHeartIcon(game: CasinoGameName): Locator {
		return this.casinoGameDropdownItem(game)
			.locator("div[class*='DropdownItem-styled__LikesWrapper']")
			.first();
	}

	public get newGamesSlider(): Locator {
		return this.page
			.locator("div[class*='Slider-styled__GameSwiperContainer']")
			.filter({
				hasText: "New Games",
				has: this.page.locator(".swiper-wrapper"),
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
		return this.newGamesSlider.locator(".swiper-slide").first();
	}

	public get sliderHeartIcon(): Locator {
		return this.firstGameInSlider.locator(
			"div[class*='styled__LikeButton']",
		);
	}

	public secondTopGame(): Locator {
		return this.topGamesSlider.locator(".swiper-slide").nth(1);
	}

	public get favoritesTab(): Locator {
		return this.page.getByRole("tab", { name: "Favorite" });
	}

	public get favoritedGamesList(): Locator {
		return this.page.locator("div[class*='styled__GameInfoWrapper']");
	}

	public get inGameHeartIcon(): Locator {
		return this.page.locator("i[class*='icon-heart']");
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

	public get searchInputFieldV4(): Locator {
		return this.page.getByTestId("external-games-search-field-input");
	}

	public get searchQuickSearchInputFieldV4(): Locator {
		return this.page.getByTestId("search-input-input");
	}

	public get casinoGamesDropdownListboxV4(): Locator {
		return this.page.getByRole("listbox");
	}

	public casinoGameInDropdownV4(game: CasinoGameName): Locator {
		return this.page
			.locator(
				'[data-testid^="quick-search-carousel-item-"][data-testid$="-container"]',
			)
			.filter({
				has: this.page.locator('[data-testid$="-title"]', {
					hasText: new RegExp(`^${game}$`),
				}),
			})
			.first();
	}
}
