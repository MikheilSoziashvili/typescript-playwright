import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class InfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get userInfoTab(): Locator {
		return this.page.locator("div.user-info-tabs");
	}

	public get adminTitle(): Locator {
		return this.page.getByTestId("adminInfo");
	}

	public get banUserContainer(): Locator {
		return this.page.locator("div.ban_ur");
	}

	public get banUserInput(): Locator {
		return this.banUserContainer.locator("input");
	}

	public get banUserButton(): Locator {
		return this.banUserContainer.locator('button:has(span:text-is("Ban"))');
	}

	public get softBanUserButton(): Locator {
		return this.banUserContainer.locator(
			'button:has(span:text-is("Soft Ban"))',
		);
	}

	public get bannedUserInfo(): Locator {
		return this.page.getByTestId("adminInfoBanReason");
	}

	public get unbanUserButton(): Locator {
		return this.bannedUserInfo.getByTestId("adminInfoUnbanButton");
	}

	public get tipButton(): Locator {
		return this.page.getByTestId("adminInfoTipButton");
	}

	public get sendNotificationButton(): Locator {
		return this.page.getByTestId("adminInfoSendNotificationButton");
	}

	public get adminInfoTable(): Locator {
		return this.page.getByTestId("adminInfoTable");
	}
}
