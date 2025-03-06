import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class UserInfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get viewUserInfoBox(): Locator {
		return this.page.locator('div.user_inf:has(h3:text-is("View user"))');
	}

	public get searchByUsernameContainer(): Locator {
		return this.viewUserInfoBox.getByTestId(
			"adminUserInfoSearchByUsername",
		);
	}
	public get searchByUsernameInput(): Locator {
		return this.searchByUsernameContainer.locator("input");
	}

	public get searchByUsernameMenu(): Locator {
		return this.searchByUsernameContainer.locator(
			"div.Select-menu-outer div.Select-menu",
		);
	}

	public get searchByUsernameMenuNoResults(): Locator {
		return this.searchByUsernameContainer.locator(
			'div.Select-noresults:text-is("Type to search")',
		);
	}
	public searchByUsernameMenuOption(option: string): Locator {
		return this.searchByUsernameContainer.locator(
			`div.Select-option:has-text("${option}")`,
		);
	}

	public get showUserInfoButton(): Locator {
		return this.viewUserInfoBox.locator('button:text-is("Show user info")');
	}

	public get adminUserInfoContainer(): Locator {
		return this.page.getByTestId("adminUserInfoContainer");
	}
	public get searchByIPContainer(): Locator {
		return this.adminUserInfoContainer.getByTestId(
			"adminUserInfoIpAddressContainer",
		);
	}
	public get searchByIPInput(): Locator {
		return this.searchByIPContainer.locator("input");
	}
	public get searchIPAddressButton(): Locator {
		return this.adminUserInfoContainer.getByTestId(
			"adminUserInfoSearchIpAddressButton",
		);
	}
	public get searchByIPLabel(): Locator {
		return this.searchByIPContainer.locator("label", {
			hasText: "IP Address",
		});
	}
}
