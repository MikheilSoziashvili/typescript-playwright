import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { GameProvider } from "@enums/game-providers";
import { OriginalGames } from "@core/types/types";
import { CasinoGameName } from "@enums/casino-game";

export class CasinoPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
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
		return this.page.locator('button[aria-label="Settings"]');
	}

	public get providersDropdownInSettingsModal(): Locator {
		return this.page.locator(
			'div[class*="RandomPickSettingsModal-styled__ModalBody"] div[role="combobox"]',
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

	public originalGameDropdownItem(game: OriginalGames): Locator {
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
						hasText: "Gamdom Originals",
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
			});
	}

	public dropdownHeartIcon(game: OriginalGames): Locator {
		return this.originalGameDropdownItem(game)
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
}
