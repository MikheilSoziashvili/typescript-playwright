import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class InfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
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
		return this.page.locator('div.form-inline:text-is("User is banned. ")');
	}

	public get unbanUserButton(): Locator {
		return this.bannedUserInfo.locator('button:text-is("Unban")');
	}
}
