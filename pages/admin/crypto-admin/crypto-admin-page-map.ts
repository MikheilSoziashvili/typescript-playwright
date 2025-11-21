import { HourlyCryptoBalancesColumn } from "@enums/admin/hourly-crypto-balances-table-columns";
import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CryptoAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get cryptoAdminPageContent(): Locator {
		return this.page.getByTestId("adminCryptoPageContent");
	}

	public get sendQueuedWithdrawalsButton(): Locator {
		return this.cryptoAdminPageContent.getByTestId(
			"sendQueuedWithdrawalsButton",
		);
	}

	public get refreshButton(): Locator {
		return this.page
			.getByTestId("currentCryptoDataContainer")
			.locator('span[class*="MuiTypography-body"]');
	}

	public minDepositButton(nodeTitle: string, currency?: string): Locator {
		let row = this.page.locator("tr").filter({ hasText: nodeTitle });
		if (currency) {
			row = row.filter({ hasText: currency });
		}
		return row.locator("td img").first();
	}

	public minWithdrawButton(nodeTitle: string, currency?: string): Locator {
		let row = this.page.locator("tr").filter({ hasText: nodeTitle });
		if (currency) {
			row = row.filter({ hasText: currency });
		}
		return row.locator("td img").nth(2);
	}

	public get cryptoTableContainer(): Locator {
		return this.page.getByTestId("denseTableContainer");
	}

	public cryptoRow(cryptoName: string): Locator {
		return this.cryptoTableContainer.locator("tbody tr", {
			has: this.page.getByRole("rowheader", { name: cryptoName }),
		});
	}

	public depositToggle(cryptoName: string): Locator {
		return this.cryptoRow(cryptoName)
			.locator("td")
			.nth(0)
			.locator('input[type="checkbox"]');
	}

	public withdrawToggle(cryptoName: string): Locator {
		return this.cryptoRow(cryptoName)
			.locator("td")
			.nth(1)
			.locator('input[type="checkbox"]');
	}

	public get hourlyCryptoBalancesContainer(): Locator {
		return this.cryptoAdminPageContent.locator(
			"[class*=AdminPanel-styled__Container]",
		);
	}

	public get hourlyCryptoBalancesHeader(): Locator {
		return this.hourlyCryptoBalancesContainer.locator(
			"[class*=AdminPanel-styled__HeaderTitle]",
		);
	}

	public get hourlyCryptoBalancesTable(): Locator {
		return this.hourlyCryptoBalancesContainer.locator(".table");
	}

	public get hourlyCryptoBalancesTableBody(): Locator {
		return this.hourlyCryptoBalancesTable.locator(
			"[class*='MuiTableBody']",
		);
	}

	public hourlyCryptoBalancesTableColumnHeader(
		colName: HourlyCryptoBalancesColumn,
	): Locator {
		return this.hourlyCryptoBalancesTable
			.locator(".MuiTableCell-head")
			.filter({ hasText: colName });
	}

	public get hourlyCryptoBalancesTableColumnHeaders(): Locator[] {
		return Object.values(HourlyCryptoBalancesColumn).map((col) =>
			this.hourlyCryptoBalancesTableColumnHeader(col),
		);
	}

	public get hourlyCryptoBalancesTableRows(): Locator {
		return this.hourlyCryptoBalancesTableBody.locator(
			"[class*='MuiTableRow']",
		);
	}

	public hourlyCryptoBalancesTableRowCells(row?: Locator): Locator {
		const parent = row ?? this.hourlyCryptoBalancesTableBody;
		return parent.locator("[class*='MuiTableCell-body']");
	}

	public hourlyCryptoBalancesTableRowCell(
		row: Locator,
		col: HourlyCryptoBalancesColumn,
	): Locator {
		return this.hourlyCryptoBalancesTableRowCells(row).nth(
			this.hourlyCryptoBalancesColumnIndex[col],
		);
	}

	public get hourlyCryptoBalancesColumnIndex(): Record<
		HourlyCryptoBalancesColumn,
		number
	> {
		return {
			[HourlyCryptoBalancesColumn.CURRENCY]: 0,
			[HourlyCryptoBalancesColumn.BACKEND_TITLE]: 1,
			[HourlyCryptoBalancesColumn.AMOUNT_CRYPTO]: 2,
			[HourlyCryptoBalancesColumn.PRICE_USD]: 3,
			[HourlyCryptoBalancesColumn.AMOUNT_USD]: 4,
			[HourlyCryptoBalancesColumn.TIME]: 5,
		};
	}
}
