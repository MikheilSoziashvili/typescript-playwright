import { BaseMap } from "@base/base-map";
import { throwError } from "@core/utils/utils";
import { OriginalGame } from "@enums/original-games";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";
import { UserMenuOption } from "@enums/user-menu-options";
import { Locator, Page } from "@playwright/test";
import { currencyAmountPattern, decimalNumber } from "@support/regex-patterns";

export class AuthenticatedHeaderMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get authenticatedHeaderContainer(): Locator {
		return this.page.locator("header[class*=HeaderNavPanel]");
	}

	public get balanceDropdownArrow(): Locator {
		return this.authenticatedHeaderContainer.locator(
			'div[role="button"][aria-expanded]:has([data-testid="nav-wallet-action-btn"]) svg.dropdown-toggle-icon',
		);
	}

	public get walletSettings(): Locator {
		return this.page.getByTestId("wallet-popover-settings-text");
	}

	public get currencyDropdownInWalletSettingsModal(): Locator {
		return this.page.getByTestId(
			"wallet-settings-v4-currency-select-button",
		);
	}

	public get walletButton(): Locator {
		return this.authenticatedHeaderContainer.getByTestId(
			"nav-wallet-action-btn",
		);
	}

	public get userAccountMenuAvatar(): Locator {
		return this.authenticatedHeaderContainer.getByTestId(
			"full-account-widget-avatar",
		);
	}

	public get userAvatarDropdownMenuContainer(): Locator {
		return this.page.locator(`div[class*="PopoverV4__StyledPopover-sc-"]`);
	}

	public userAvatarDropdownItem(dropdownItem: UserMenuOption): Locator {
		return this.userAvatarDropdownMenuContainer.locator("a").filter({
			has: this.page.getByTestId(
				`account-popover-${dropdownItem.toLowerCase()}-name`,
			),
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

	public get inGameAccountBalanceContainer(): Locator {
		return this.page.getByTestId(
			"headerUserBalance",
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
		return this.page.getByTestId("nav-desktop-Gamdom-Originals-tab");
	}

	public get originalGamesSubMenuContainer(): Locator {
		return this.page.locator("div[class*='GamdomOriginalsContainer']");
	}

	public gameSubMenuLink(game: OriginalGame): Locator {
		return this.originalGamesSubMenuContainer.filter({
			has: this.page.locator(`a[href='/${game}']`),
		});
	}

	private headerNavigationTab(tabName: string): Locator {
		return this.page.getByTestId(`nav-desktop-${tabName}-tab`);
	}

	public get casinoNavigationButton(): Locator {
		return this.headerNavigationTab("casino");
	}

	public get supportNavigationButton(): Locator {
		return this.headerNavigationTab("support");
	}

	public get rewardsNavigationButton(): Locator {
		return this.headerNavigationTab("rewards");
	}

	public selectCurrencyOption(currency: string): Locator {
		return this.page.getByTestId(
			`wallet-settings-v4-currency-select-option-${currency}`,
		);
	}

	public get saveSettingsButton(): Locator {
		return this.page.getByTestId("close-modal-btn");
	}

	public walletOption(cryptoCurrency: string): Locator {
		return this.page.locator(
			'[data-testid^="wallet-popover-"][data-testid$="-name"]',
			{
				hasText: new RegExp(`^${cryptoCurrency}$`),
			},
		);
	}

	public walletBalanceValue(cryptoCurrency: string): Locator {
		return this.page
			.locator("div", { hasText: new RegExp(`^${cryptoCurrency}$`) })
			.locator("~ div span.animation-finished");
	}

	public get accountBalance(): Locator {
		return this.authenticatedHeaderContainer.getByTestId(
			"headerUserBalance",
		);
	}

	public get accountBalanceAnimationFinished(): Locator {
		return this.accountBalance.locator(":scope.animation-finished");
	}

	public get userAccountMenuStack(): Locator {
		return this.authenticatedHeaderContainer.getByTestId(
			"full-account-widget-stack",
		);
	}

	public get userAccountUsername(): Locator {
		return this.userAccountMenuStack.getByTestId(
			"full-account-widget-username",
		);
	}

	public async getLoadedAccountBalance(): Promise<Locator> {
		const accountBalanceLocator = this.accountBalance;
		const accountBalanceAnimationFinishedLocator =
			this.accountBalanceAnimationFinished;

		await accountBalanceAnimationFinishedLocator.waitFor({
			state: VisibilityState.VISIBLE,
			timeout: Timeout.LONG,
		});

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
}
