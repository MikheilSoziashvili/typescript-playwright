import { BaseAsserter } from "@base/base-asserter";
import { TransactionsAdminPage } from "./transactions-admin-page";
import { expect } from "@playwright/test";
import { step } from "decorators/step";

export class TransactionsAdminPageAsserter extends BaseAsserter<TransactionsAdminPage> {
	public constructor(page: TransactionsAdminPage) {
		super(page);
	}

	@step("Verify logs table transaction details column values")
	public async verifyLogsTableTransactionDetailsColumnValues(
		expectedValues: string[],
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.logsTableBody]);

		const actualValues =
			await this.gamdomPage.map.logsTableTransactionDetailsColumn.allTextContents();

		expect(
			actualValues.length,
			`Mismatch in the number of rows. Expected: ${expectedValues.length}, Actual: ${actualValues.length}`,
		).toBe(expectedValues.length);

		const missingValues = expectedValues.filter(
			(value) => !actualValues.includes(value),
		);

		expect(
			missingValues,
			`The following expected values were not found in the transaction details column: ${missingValues.join(
				", ",
			)}`,
		).toHaveLength(0);
	}
}
