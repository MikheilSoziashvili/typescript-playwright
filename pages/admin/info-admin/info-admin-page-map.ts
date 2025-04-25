import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class InfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get userInfoTab(): Locator {
		return this.page.getByTestId("userInfoTabsContainer");
	}

	public get adminTitle(): Locator {
		return this.page.getByTestId("user-username");
	}

	public get banUserContainer(): Locator {
		return this.page.getByTestId("adminInfoBanContainer");
	}

	public get banUserInput(): Locator {
		return this.banUserContainer.getByTestId("adminInfoBanReasonInput");
	}

	public get banUserButton(): Locator {
		return this.banUserContainer.getByTestId("adminInfoBanButton");
	}

	public get softBanUserButton(): Locator {
		return this.banUserContainer.getByTestId("adminInfoSoftBanButton");
	}

	public get bannedUserInfo(): Locator {
		return this.page.getByTestId("adminInfoBanReason");
	}

	public get unbanUserButton(): Locator {
		return this.bannedUserInfo.getByTestId("adminInfoUnbanButton");
	}

	public get tipButton(): Locator {
		return this.tipUserContainer.getByTestId("adminInfoTipButton");
	}

	public get sendNotificationButton(): Locator {
		return this.page.getByTestId("adminInfoSendNotificationButton");
	}

	public get adminInfoTable(): Locator {
		return this.page.getByTestId("adminInfoTable");
	}

	public get tipUserContainer(): Locator {
		return this.page.getByTestId("adminInfoTipContainer");
	}

	public get tipAmountInput(): Locator {
		return this.tipUserContainer.getByPlaceholder("Tip amount");
	}
}
