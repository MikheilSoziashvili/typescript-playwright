import { BaseAsserter } from "@base/base-asserter";
import { UserInfoEditInfoAdminPage } from "./user-info-edit-info-admin-page";
import { step } from "decorators/step";
import { UserTags } from "@enums/db/user-tags";
import { expect } from "@playwright/test";

export class UserInfoEditInfoAdminPageAsserter extends BaseAsserter<UserInfoEditInfoAdminPage> {
	public constructor(page: UserInfoEditInfoAdminPage) {
		super(page);
	}

	@step("Verify if user tags are checked or not")
	public async verifyTagsAreChecked(
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

	@step("Verify if user tags are visible")
	public async verifyTagsAreVisible(tags: UserTags[]): Promise<void> {
		await Promise.all(
			tags.map(async (tag) => {
				const tagLabel = this.gamdomPage.map.getTagLabel(tag);
				await expect(tagLabel).toBeVisible();
			}),
		);
	}
}
