import { NewUserAttribute } from "@enums/admin/new-user-attributes";
import { NewUserTableColumn } from "@enums/admin/new-user-table-columns";
import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class NewUsersAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get newUsersAdminPageContent(): Locator {
		return this.page.getByTestId("adminNewUsersPageContent");
	}

	public get betweenDatesCheckbox(): Locator {
		return this.page.getByTestId("betweenDatesCheckbox");
	}

	public get betweenDatesStartDateField(): Locator {
		return this.page.getByTestId("startDateField").locator("input");
	}

	public get betweenUserIDsCheckbox(): Locator {
		return this.page.getByTestId("betweenUserIDsCheckbox");
	}

	public get betweenUserIDsStartUserIDField(): Locator {
		return this.page.getByTestId("startUserIDInput");
	}

	public get betweenUserIDsEndUserIDField(): Locator {
		return this.page.getByTestId("endUserIDInput");
	}

	public get fetchNewUsersSettingsContainer(): Locator {
		return this.newUsersAdminPageContent.getByTestId(
			"fetchNewUsersSettingsContainer",
		);
	}

	public get fetchNewUsersSettingsHeader(): Locator {
		return this.fetchNewUsersSettingsContainer.getByTestId(
			"fetchNewUsersSettingsTitle",
		);
	}

	public get fetchNewUsersSettingsButton(): Locator {
		return this.fetchNewUsersSettingsContainer.getByTestId(
			"fetchUsersButton",
		);
	}

	public get attributesToFetchContainer(): Locator {
		return this.page.getByTestId("attributesToFetchContainer");
	}

	public newUsersAttributeCheckbox(
		newUsersAttribute: NewUserAttribute,
	): Locator {
		return this.attributesToFetchContainer.getByTestId(
			`attributeCheckbox-${newUsersAttribute}`,
		);
	}

	public get newUsersTable(): Locator {
		return this.page.getByTestId("queryResultTable");
	}

	public get newUsersTableColumnHeaders(): Locator[] {
		return Object.values(NewUserTableColumn).map((col) =>
			this.newUsersTableColumnHeader(col),
		);
	}

	public newUsersTableColumnHeader(
		colName: NewUserTableColumn | NewUserAttribute,
	): Locator {
		return this.newUsersTable.getByTestId(`queryResultColumn-${colName}`);
	}

	public get newUsersTableRows(): Locator {
		return this.newUsersTable.locator('[data-testid^="queryResultRow-"]');
	}
}
