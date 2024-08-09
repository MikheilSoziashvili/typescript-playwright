import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { decimalNumber } from "@support/regex-patterns";
import { OriginalGame } from "@enums/original-games";
import { throwError } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";

export class AuthenticatedHeaderMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get balanceDropdownArrow(): Locator {
		return this.page.locator("i.bal-arrow.icon-angle-down");
	}

	public get walletBtn(): Locator {
		return this.page.locator("a[href='/wallet']");
	}

	public get userAvatarMenuButton(): Locator {
		return this.page.locator("div[class*= UserAvatarWithMenu]");
	}

	public get userAvatar(): Locator {
		return this.page.locator("div.MuiAvatar-rounded");
	}

	public get chatButton(): Locator {
		return this.page.locator("button i.icon-Chat");
	}

	public async getLoadedAccountBalance(): Promise<Locator> {
		const accountBalanceLocator = await this.accountBalance();

		await this.waitForAttributeToHaveValue(
			accountBalanceLocator,
			"class",
			"animation-finished",
			Timeout.LONG,
		);

		await this.highlightElement(accountBalanceLocator);

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
}
