import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";
import { OriginalGame } from "../../enums/original-games";
import { promisify } from "util";

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

	// Temporary google auth locators needed for authentication in cloudflare using environment from coder
	public get gEmailField(): Locator {
		return this.page.locator("#identifierId");
	}

	public get gMoveForwardBtn(): Locator {
		return this.page.locator("#identifierNext > div > button > span");
	}

	public get gPasswordField(): Locator {
		return this.page.locator("input[name='Passwd']");
	}

	public get gPasswordNextBtn(): Locator {
		return this.page.locator("#passwordNext > div > button > span");
	}

	public get userAvatar(): Locator {
		return this.page.locator("img[class*='MuiAvatar-img']");
	}

	public get toastMessage(): Locator {
		return this.page.locator("*[role='alert']");
	}
	// The same as userAvatar, but there are locator discrepancies across different branches
	public get userIcon(): Locator {
		return this.page.locator("svg.MuiSvgIcon-root.MuiAvatar-fallback");
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
		return await this.waitUntilVisible(
			this.page.locator(
				"div[class*='header'] > div:nth-child(2) > div:nth-child(2) div[style*='tabular']",
			),
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
