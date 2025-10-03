import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { decimalNumber, currencyAmountPattern } from "@support/regex-patterns";
import { OriginalGame } from "@enums/original-games";
import { throwError } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import { UserMenuOption } from "@enums/user-menu-options";

export class AuthenticatedHeaderMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get authenticatedHeaderContainer(): Locator {
		return this.page.locator("[class*='HeaderContainer']");
	}

	public get balanceDropdownArrow(): Locator {
		return this.authenticatedHeaderContainer.locator(
			"i.bal-arrow.icon-angle-down",
		);
	}

	public get walletBtn(): Locator {
		return this.authenticatedHeaderContainer.locator("a[href='/wallet']");
	}

	public get userAvatarMenuButton(): Locator {
		return this.authenticatedHeaderContainer.getByTestId(
			"userAvatarWithMenu",
		);
	}

	public get userAvatarDropdownMenuContainer(): Locator {
		return this.authenticatedHeaderContainer.locator(
			`div[class*="UserAvatarWithMenu-styled__MenuContainer"]`,
		);
	}

	public userAvatarDropdownItem(dropdownItem: UserMenuOption): Locator {
		return this.userAvatarDropdownMenuContainer.locator(`a button`, {
			hasText: `${dropdownItem}`,
		});
	}

	public get userAvatar(): Locator {
		return this.authenticatedHeaderContainer.locator(
			"div.MuiAvatar-rounded",
		);
	}

	public get chatButton(): Locator {
		return this.authenticatedHeaderContainer.getByTestId("iconChatButton");
	}

	public async getLoadedAccountBalance(): Promise<Locator> {
		const accountBalanceLocator = await this.accountBalance();

		await this.waitForAttributeToHaveValue(
			accountBalanceLocator,
			Attributes.CLASS,
			AttributesValues.ANIMATION_FINISHED,
			Timeout.LONG,
		);

		await accountBalanceLocator.hover({ trial: true });
		await accountBalanceLocator.focus();

		try {
			// workaround for $0 balance on page load bug
			return await this.waitUntilContainsText(
				accountBalanceLocator,
				decimalNumber,
			);
		} catch (error) {
			throwError(error, "Error resolving account balance");
		}
	}

	public async accountBalance(): Promise<Locator> {
		return this.page.locator(
			"div[class*='header'] > div:nth-child(2) > div:nth-child(2) div[style*='tabular']",
		);
	}

	public get inGameAccountBalanceContainer(): Locator {
		return this.page.locator(
			"//div[contains(@class, 'header')]//i[contains(@class,'arrow')]//parent::div/div/div",
		);
	}

	public get inGameAccountBalance(): Locator {
		return this.inGameAccountBalanceContainer.filter({
			hasText: currencyAmountPattern(),
		});
	}

	public get inGameBalancePlayingStatus(): Locator {
		return this.inGameAccountBalanceContainer.locator("span", {
			hasText: "Playing...",
		});
	}

	public get originalGamesMenuLink(): Locator {
		return this.page.locator('header a[class*="MenuLink"][href="/"]');
	}

	public get originalGamesSubMenuContainer(): Locator {
		return this.page.locator("div[class*='GamdomOriginalsContainer']");
	}

	public gameSubMenuLink(game: OriginalGame): Locator {
		return this.originalGamesSubMenuContainer.filter({
			has: this.page.locator(`a[href='/${game}']`),
		});
	}

	private headerNavigationButtons(button: string): Locator {
		return this.page.locator(
			`header a[class*="MenuLink"][href="/${button}"]`,
		);
	}

	public get casinoNavigationButton(): Locator {
		return this.headerNavigationButtons("casino");
	}

	public get supportNavigationButton(): Locator {
		return this.headerNavigationButtons("help/support");
	}

	public get rewardsNavigationButton(): Locator {
		return this.headerNavigationButtons("rewards");
	}

	public selectCurrencyOption(currency: string): Locator {
		return this.page.locator(
			`input[type='radio'][aria-label='${currency}']`,
		);
	}

	public get balanceDropdown(): Locator {
		return this.page.getByTestId("headerBalanceArrowDropdownButton");
	}

	public walletOption(cryptoCurrency: string): Locator {
		return this.page.locator("div[class*='navbarMain']", {
			hasText: new RegExp(`^${cryptoCurrency}$`),
		});
	}

	public walletBalanceValue(cryptoCurrency: string): Locator {
		return this.page
			.locator("div", { hasText: new RegExp(`^${cryptoCurrency}$`) })
			.locator("~ div span.animation-finished");
	}

	public get accountBalanceValueInCasinoGame(): Locator {
		return this.page.getByTestId("balanceAmoutLabel");
	}
}
