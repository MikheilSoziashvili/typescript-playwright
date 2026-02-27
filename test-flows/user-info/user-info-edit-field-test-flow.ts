import { BaseTestFlow, testFlow } from "@test-flows";
import { UserInfoEditInfoAdminPage } from "@pages/admin/user-info-admin/user-info-edit-info-admin/user-info-edit-info-admin-page";
import { ToastAsserter } from "@pages/components/toast/toast-asserter";
import { Page } from "@playwright/test";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";

export interface EditFieldParams {
	userInfoEditInfoAdminPage: UserInfoEditInfoAdminPage;
	toast: ToastAsserter;
	page: Page;
	fieldName: string;
	validValue: number;
	invalidValue: number;
	expectedErrorMessage: ToastSubTitle;
}

export class UserInfoEditFieldFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Edit field and verify toasts")
	public async editFieldAndVerifyToasts(
		params: EditFieldParams,
	): Promise<void> {
		const {
			userInfoEditInfoAdminPage,
			toast,
			page,
			fieldName,
			validValue,
			invalidValue,
			expectedErrorMessage,
		} = params;

		this.log(`Editing field: ${fieldName}`);
		this.log(
			`Filling in the ${fieldName} field with valid value: ${validValue}`,
		);

		await userInfoEditInfoAdminPage
			.steps()
			.adjustValueByLabel(fieldName, validValue);

		this.log("Clicking Save button and verifying success toast");

		await userInfoEditInfoAdminPage.clickSaveButton();
		await toast.toastMessageIs(
			ToastTitle.SUCCESS,
			ToastSubTitle.SUCCESSFUL_EDIT,
		);
		await toast.isNotDisplayed();

		this.log(
			`Filling in the ${fieldName} field with invalid value: ${invalidValue}`,
		);

		await page.reload();
		await userInfoEditInfoAdminPage
			.steps()
			.adjustValueByLabel(fieldName, invalidValue);

		this.log("Clicking Save button and verifying error toast");

		await userInfoEditInfoAdminPage.clickSaveButton();
		await toast.toastMessageIs(ToastTitle.FAILED, expectedErrorMessage);

		this.log("Field edit flow completed successfully");
	}
}
