import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoEditInfoAdminPageMap } from "./user-info-edit-info-admin-page-map";
import { UserInfoEditInfoAdminPageAsserter } from "./user-info-edit-info-admin-page-asserter";
import { UserInfoEditInfoAdminPageSteps } from "./user-info-edit-info-admin-page-steps";
import { UserTags } from "@enums/db/user-tags";
import { step } from "decorators/step";

export class UserInfoEditInfoAdminPage extends BasePage<UserInfoEditInfoAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoEditInfoAdminPageMap(page));
	}

	public override assertThat(): UserInfoEditInfoAdminPageAsserter {
		return new UserInfoEditInfoAdminPageAsserter(this);
	}

	public steps(): UserInfoEditInfoAdminPageSteps {
		return new UserInfoEditInfoAdminPageSteps(this);
	}

	@step(`Toggle a given checkbox by a given User Tag`)
	public async toggleTag(tagName: UserTags): Promise<void> {
		await this.map.getTagCheckbox(tagName).click();
	}

	@step(`Check if a given User Tag is checked`)
	public async isTagChecked(tagName: UserTags): Promise<boolean> {
		const checkbox = this.map.getTagCheckbox(tagName);
		const classAttr = await checkbox.getAttribute("class");
		return classAttr?.includes("icon-check-square-o") ?? false;
	}

	@step(`Click save button`)
	public async clickSaveButton(): Promise<void> {
		await this.map.saveButton.click();
	}
}
