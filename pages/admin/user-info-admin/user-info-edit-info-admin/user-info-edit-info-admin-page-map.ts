import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { UserTags } from "@enums/db/user-tags";

export class UserInfoEditInfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public getTagCheckbox(tag: UserTags): Locator {
		return this.page.locator(`xpath=//span[normalize-space(.)='${tag}']/i`);
	}

	public getTagLabel(tag: UserTags): Locator {
		return this.page.getByText(tag, { exact: true });
	}
	public get saveButton(): Locator {
		return this.page.locator("button", { hasText: "SAVE" });
	}

	public rowByLabel(wallet: string): Locator {
		return this.page.locator("tr", {
			has: this.page.locator("td", { hasText: wallet }),
		});
	}

	public rowInputByLabel(wallet: string): Locator {
		return this.rowByLabel(wallet).getByTestId("Input");
	}
}
