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

	public get statsCalculationCheckbox(): Locator {
		return this.transactionsAdminPageContent.getByTestId(
			`stats-calculations-checkbox`,
		);
	}

	public get logsTableBalanceAfterColumn(): Locator {
		return this.logsTableBody.locator(
			'[data-testid="transaction-balance-after"]:not(.user-event-info)',
		);
	}

	public get wageredStatsTable(): Locator {
		return this.page.getByTestId("wagered-stats-table");
	}

	public get plinkoWageredCell(): Locator {
		return this.wageredStatsTable.getByTestId("plinko-wagered");
	}

	public get totalWinningsCell(): Locator {
		return this.wageredStatsTable.getByTestId("total-winnings");
	}

	public get totalProfitCell(): Locator {
		return this.wageredStatsTable.getByTestId("total-profit");
	}

	public getDetailsButtonInRow(row: Locator): Locator {
		return row
			.getByTestId("transaction-details")
			.getByTestId("toggle-detail-icon");
	}

	public getRowsByTransactionType(type: string): Locator {
		return this.logsTableRows.filter({
			has: this.page
				.getByTestId("transaction-type")
				.filter({ hasText: type }),
		});
	}

	public async getRowByTypeWithBalance(type: string): Promise<Locator> {
		const rows = this.getRowsByTransactionType(type);
		const count = await rows.count();

		for (let i = 0; i < count; i++) {
			const row = rows.nth(i);
			const balanceCell = row.getByTestId("transaction-balance-after");
			const balanceText = await balanceCell.textContent();

			if (balanceText && balanceText.trim() !== "") {
				return row;
			}
		}

		throw new Error(
			`No row found with type "${type}" that has a balance value`,
		);
	}

	public get transactionDetailContent(): Locator {
		return this.page.getByTestId("transaction-detail-content");
	}
}
