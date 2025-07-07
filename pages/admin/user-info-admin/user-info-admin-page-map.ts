import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export class UserInfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get viewUserInfoBox(): Locator {
		return this.page.getByTestId("adminUserInfoContainer");
	}

	public get searchByUsernameContainer(): Locator {
		return this.viewUserInfoBox.getByTestId(
			"adminUserInfoSearchByUsername",
		);
	}

	public get searchByUsernameInput(): Locator {
		return this.searchByUsernameContainer.locator("input");
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
		return this.viewUserInfoBox.getByTestId("adminUserInfoShowInfoButton");
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

	public get searchBySteam64OrUserIdContainer(): Locator {
		return this.adminUserInfoContainer.getByTestId(
			"adminUserInfoSearchBySteamUserId",
		);
	}

	public get searchBySteam64OrUserIdInput(): Locator {
		return this.searchBySteam64OrUserIdContainer.locator("input");
	}

	public get searchBySteamUserIdButton(): Locator {
		return this.adminUserInfoContainer.getByTestId(
			"adminUserInfoSearchBySteamUserIdButton",
		);
	}

	public get userInfoTabs(): Locator {
		return this.page.getByTestId("admin-user-info-tabs");
	}

	public userInfoTab(tab: UserInfoTabs): Locator {
		return this.userInfoTabs.getByTestId(`admin-user-info-item-${tab}`);
	}
}
