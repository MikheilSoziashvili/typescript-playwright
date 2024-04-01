import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";
import { OriginalGame } from "../../enums/original-games";
import { decimalNumber } from "../../support/regex-patterns";

export class HomePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	// Locators must be improved by adding an additional data-testid attributes
	public get loginBtn(): Locator {
		return this.page.getByTestId("signin-nav");
	}

	public get signUpBtn(): Locator {
		return this.page.getByTestId("signup-nav");
	}

	public get userAvatarMenuButton(): Locator {
		return this.page.locator("div[class*= UserAvatarWithMenu]");
	}

	public get userAvatar(): Locator {
		return this.page.locator("img[class*='MuiAvatar-img']");
	}

	public get toastMessage(): Locator {
		return this.page.locator("*[role='alert']");
	}

	public get balanceDropdownArrow(): Locator {
		return this.page.locator("i.bal-arrow.icon-angle-down");
	}

	public get walletBtn(): Locator {
		return this.page.locator("a[href='/wallet']");
	}

	public get registerSuccessMessage(): Locator {
		return this.page.locator("p[type='success']");
	}

	public get welcomeBackMessage(): Locator {
		return this.page.locator(
			"[class*='Welcome-styled__WelcomeText'] + span",
		);
	}

	public async accountBalance(): Promise<Locator> {
		const accountBalance = await this.waitUntilVisible(
			this.page.locator(
				"div[class*='header'] > div:nth-child(2) > div:nth-child(2) div[style*='tabular']",
			),
		);

		try {
			return await this.waitUntilContainsText(
				accountBalance,
				decimalNumber,
			); //workaround for $0 balance on page load bug
		} catch (error) {
			const msg = "Error resolving account balance";
			if (error instanceof Error) {
				throw new Error(`${msg}: ${error.message}`);
			}
			throw new Error(msg);
		}
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
