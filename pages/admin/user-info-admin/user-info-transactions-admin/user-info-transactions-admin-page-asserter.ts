import { BaseAsserter } from "@base/base-asserter";
import { UserInfoTransactionsAdminPage } from "./user-info-transactions-admin-page";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { waitUntil } from "@core/utils/utils";
import { logger } from "@logger/logger";

export class UserInfoTransactionsAdminPageAsserter extends BaseAsserter<UserInfoTransactionsAdminPage> {
	public constructor(page: UserInfoTransactionsAdminPage) {
		super(page);
	}

	@step("Verify logs table transaction details column values")
	public async verifyLogsTableTransactionDetailsColumnValues(
		expectedValues: string[],
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.logsTableBody]);

		let actualValues: string[] = [];

		await waitUntil(
			async () => {
				actualValues =
					await this.gamdomPage.map.logsTableTransactionDetailsColumn.allTextContents();
				logger.info(
					`Waiting for table rows. Got: ${actualValues.length}`,
				);
				return actualValues.length === expectedValues.length;
			},
			{
				errorMessage: `Mismatch in the number of rows. Expected: ${expectedValues.length}, Actual: ${actualValues.length}`,
				intervalSeconds: 1,
				timeoutSeconds: 5,
			},
		);

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
