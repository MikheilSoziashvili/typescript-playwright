import { BaseAsserter } from "@base/base-asserter";
import { UserTags } from "@enums/db/user-tags";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { UserInfoEditInfoAdminPage } from "./user-info-edit-info-admin-page";

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

	@step("Verify if additional wallet fields are visible")
	public async verifyAdditionalFieldsAreVisible(
		fields: string[],
	): Promise<void> {
		await Promise.all(
			fields.map(async (field) => {
				const walletLabel = this.gamdomPage.map.rowByKeyExact(field);
				await this.checkElementsAreVisible([walletLabel]);
			}),
		);
	}

	@step("Verify if user tags are visible")
	public async verifyTagsAreVisible(tags: UserTags[]): Promise<void> {
		await Promise.all(
			tags.map(async (tag) => {
				const tagLabel = this.gamdomPage.map.getTagLabel(tag);
				await this.checkElementsAreVisible([tagLabel]);
			}),
		);
	}
}
