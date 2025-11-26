import { BaseAsserter } from "@base/base-asserter";
import { UserTags } from "@enums/db/user-tags";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { UserInfoEditInfoAdminPage } from "./user-info-edit-info-admin-page";
import { ToastSubTitle } from "@enums/toast-subtitles";
import {
	EsportsCategory,
	EsportsToastResult,
} from "@enums/esport-toast-results";

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

	/**
	 * Starts observing the Save button state before triggering a click,
	 * then verifies that it transitions to 'SAVING...' and becomes disabled.
	 * This method must own the click to reliably catch the transient state.
	 */
	@step("Assert button becomes disabled and shows 'SAVING...'")
	public async clickSaveAndAssertTransitionToSaving(): Promise<void> {
		const savingButton = this.gamdomPage.map.savingButton;

		await Promise.all([
			expect(savingButton).toHaveText("SAVING..."),
			expect(savingButton).toBeDisabled(),
			this.gamdomPage.map.saveButton.click(),
		]);
	}

	@step("Assert button is enabled and shows 'SAVE'")
	public async saveButtonIsEnabledWithSaveText(): Promise<void> {
		const saveButton = this.gamdomPage.map.saveButton;
		await expect(saveButton).toBeEnabled();
		await expect(saveButton).toHaveText("SAVE");
	}

	@step("Assert eSports category toast behavior")
	public async assertEsportsCategoryToast(
		category: string,
		toastText: string,
	): Promise<EsportsToastResult> {
		const isDefault = category === EsportsCategory.DEFAULT_CATEGORY;

		const expectedToast = isDefault
			? ToastSubTitle.NO_CHANGES_WERE_MADE
			: ToastSubTitle.SUCCESSFUL_EDIT;

		expect(toastText).toContain(expectedToast);

		return isDefault
			? EsportsToastResult.DEFAULT_CATEGORY_NO_CHANGE
			: EsportsToastResult.CATEGORY_UPDATED;
	}
}
