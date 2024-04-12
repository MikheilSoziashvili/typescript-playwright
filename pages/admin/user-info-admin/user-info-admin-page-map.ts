import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export class UserInfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get viewUserInfoBox(): Locator {
		return this.page.locator('div.user_inf:has(h3:text-is("View user"))');
	}

	public get seachByUsernameContainer(): Locator {
		return this.viewUserInfoBox.locator("div.search-by-username");
	}

	public get seachByUsernameInput(): Locator {
		return this.seachByUsernameContainer.locator("input");
	}

	public get seachByUsernameMenu(): Locator {
		return this.seachByUsernameContainer.locator(
			"div.Select-menu-outer div.Select-menu",
		);
	}

	public seachByUsernameMenuOption(option: string): Locator {
		return this.seachByUsernameContainer.locator(
			`div.Select-option:has-text("${option}")`,
		);
	}

	public get showUserInfoButton(): Locator {
		return this.viewUserInfoBox.locator('button:text-is("Show user info")');
	}
}
