import { BaseAsserter } from "@base/base-asserter";
import { UserInfoEditInfoAdminPage } from "./user-info-edit-info-admin-page";
import { step } from "decorators/step";
import { UserTags } from "@enums/db/user-tags";
import { expect } from "@playwright/test";

export class UserInfoEditInfoAdminPageAsserter extends BaseAsserter<UserInfoEditInfoAdminPage> {
	public constructor(page: UserInfoEditInfoAdminPage) {
		super(page);
	}

	@step("Assert if user tags are checked or not")
	public async assertTagsChecked(
		tags: UserTags[],
		shouldBeChecked: boolean,
	): Promise<void> {
		await Promise.all(
			tags.map(async (tag) => {
				const isChecked = await this.gamdomPage.isTagChecked(tag);
				expect(isChecked).toBe(shouldBeChecked);
			}),
		);
	}
}
