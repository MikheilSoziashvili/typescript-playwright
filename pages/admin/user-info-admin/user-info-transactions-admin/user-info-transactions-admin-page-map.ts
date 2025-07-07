import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UserInfoTransactionsAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get adminInfoNavigationTabsContainer(): Locator {
		return this.page.getByTestId(`admin-user-info-tabs`);
	}

	public get transactionsNavigationTabsButton(): Locator {
		return this.adminInfoNavigationTabsContainer.getByTestId(
			`admin-user-info-item-link-Transactions`,
		);
	}

	public get transactionsAdminPageContent(): Locator {
		return this.page.getByTestId(`admin-user-transactions`);
	}

	public get logTypesToFetchFieldContainer(): Locator {
		return this.transactionsAdminPageContent.getByTestId(
			`log-type-multiselect`,
		);
	}

	public get clearLogTypesButton(): Locator {
		return this.logTypesToFetchFieldContainer.getByTitle(`Clear all`);
	}

	public get logTypesToFetchFieldInput(): Locator {
		return this.logTypesToFetchFieldContainer.locator(`input`);
	}

	public get fetchWithDateButton(): Locator {
		return this.transactionsAdminPageContent.getByTestId(
			`fetch-transactions-button`,
		);
	}

	public get logsTableContainer(): Locator {
		return this.transactionsAdminPageContent.getByTestId(
			`transactions-table`,
		);
	}

	public get logsTableBody(): Locator {
		return this.logsTableContainer.locator(`tbody`);
	}

	public get logsTableRows(): Locator {
		return this.logsTableBody.getByTestId(`user-transaction-row`);
	}

	public get logsTableTransactionDetailsColumn(): Locator {
		return this.logsTableBody.locator(
			'[data-testid="transaction-details"]:not(.user-event-info)',
		);
	}
}
