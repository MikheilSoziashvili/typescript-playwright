import { BaseAsserter } from "@pages/base/base-asserter";
import { NewUsersAdminPage } from "./new-users-admin-page";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";

export class NewUsersAdminAsserter extends BaseAsserter<NewUsersAdminPage> {
	public constructor(page: NewUsersAdminPage) {
		super(page);
	}

	@step("Check 'Between Dates' filter is selected")
	public async betweenDatesFilterSelected(): Promise<void> {
		await this.expectElementToHaveClass(
			this.gamdomPage.map.betweenDatesCheckbox,
			AttributesValues.ICON_CHECKBOX_CHECKED,
		);
	}

	@step("Check 'Between User IDs' filter is selected")
	public async betweenUserIDsFilterSelected(): Promise<void> {
		await this.expectElementToHaveClass(
			this.gamdomPage.map.betweenUserIDsCheckbox,
			AttributesValues.ICON_CHECKBOX_CHECKED,
		);
	}

	@step("Check all New Users table columns are visible")
	public async newUsersTableColumnsVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			this.gamdomPage.map.newUsersTableColumnHeaders,
		);
	}

	@step("Check New Users table has entries")
	public async newUsersTableRowsPresent(): Promise<void> {
		// Get first and last elements, because 1K are loaded and test duration increases a lot
		const tableRows = [
			this.gamdomPage.map.newUsersTableRows.first(),
			this.gamdomPage.map.newUsersTableRows.last(),
		];
		expect(
			tableRows.length,
			"New Users table rows are missing",
		).toBeGreaterThan(0);

		await this.checkElementsAreVisible(tableRows);
	}

	@step("Check all New Users table columns are visible and has entries")
	public async newUsersTableAllColumnsAndRowsPresent(): Promise<void> {
		await this.newUsersTableColumnsVisible();
		await this.newUsersTableRowsPresent();
	}

	@step("Check toast message for successful fetch is visible")
	public async toastMessageSuccessfulFetchVisible(): Promise<void> {
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.ADMIN_NEW_USERS_TABLE_FETCHED_SUCCESSFULLY,
			);
	}
}
