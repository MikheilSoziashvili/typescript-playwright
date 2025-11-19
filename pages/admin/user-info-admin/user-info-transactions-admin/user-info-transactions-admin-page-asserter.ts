import { BaseAsserter } from "@base/base-asserter";
import { UserInfoTransactionsAdminPage } from "./user-info-transactions-admin-page";
import { expect, Locator } from "@playwright/test";
import { buildTransactionTypeAndValueNotFoundMessage } from "@core/helpers/asserter-helpers/text-asserters";
import { step } from "decorators/step";
import { parseToFloat, waitUntil } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { currencyToNumberPattern } from "@support/regex-patterns";
import { TransactionDetailsText } from "@enums/admin/transaction-details-text";

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

	/**
	 * Extracts the "Balance After" values for all winning rounds from the transactions table.
	 *
	 * This method uses the transaction details column to find only rows marked as "WIN",
	 * then maps those rows to the corresponding values in the Balance After column.
	 * The returned list is reversed to ensure newest transactions appear first.
	 *
	 * @param transactionDetails - The text contents of the transaction details column.
	 * @param allBalanceAfterValues - The text contents of the Balance After column.
	 * @returns An array of balance strings for winning rounds, sorted newest first.
	 */
	private getBalancesForWinningRounds(
		transactionDetails: string[],
		allBalanceAfterValues: string[],
	): string[] {
		const winRowIndexes = transactionDetails
			.map((text, rowIndex) => (text.includes("WIN") ? rowIndex : -1))
			.filter((rowIndex) => rowIndex !== -1);

		return winRowIndexes
			.map((rowIndex) => allBalanceAfterValues[rowIndex])
			.reverse();
	}

	@step("Verify logs table Balance After column values")
	public async verifyLogsTableBalanceAfterColumnValues(
		expectedValues: number[],
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.logsTableBody]);

		const [transactionDetails, allBalanceAfterValues] = await Promise.all([
			this.gamdomPage.map.logsTableTransactionDetailsColumn.allTextContents(),
			this.gamdomPage.map.logsTableBalanceAfterColumn.allTextContents(),
		]);

		const winBalances = this.getBalancesForWinningRounds(
			transactionDetails,
			allBalanceAfterValues,
		);

		logger.info(`Balance After WIN rows: ${JSON.stringify(winBalances)}`);

		const formattedExpectedValues = expectedValues.map(
			(balance) => `$${balance.toLocaleString()}`,
		);

		expect(winBalances.length).toBe(formattedExpectedValues.length);
		expect(winBalances).toEqual(formattedExpectedValues);
	}

	@step("Verify Plinko total wagered")
	public async verifyPlinkoTotalWagered(
		expectedValue: string,
	): Promise<void> {
		const actualValue =
			await this.gamdomPage.map.plinkoWageredCell.innerText();
		logger.info(`Plinko total wagered displayed: ${actualValue}`);
		expect(actualValue.trim()).toBe(expectedValue);
	}

	@step("Verify stats value")
	private async verifyStatsValue(
		cell: Locator,
		expectedValue: number,
	): Promise<void> {
		await this.gamdomPage.map.wageredStatsTable.scrollIntoViewIfNeeded();
		const actualValue = await cell.innerText();
		const parsedValue = parseFloat(
			actualValue.replace(currencyToNumberPattern, ""),
		);
		expect(parsedValue).toBe(expectedValue);
	}

	@step("Verify total winnings stats")
	public async totalWinningsStatsAreCorrect(
		expectedWinnings: number,
	): Promise<void> {
		await this.verifyStatsValue(
			this.gamdomPage.map.totalWinningsCell,
			expectedWinnings,
		);
	}

	@step("Verify total profit stats")
	public async totalProfitStatsAreCorrect(
		expectedProfit: number,
	): Promise<void> {
		await this.verifyStatsValue(
			this.gamdomPage.map.totalProfitCell,
			expectedProfit,
		);
	}

	@step("Verify transaction exists with given type and value")
	public async hasTransactionWithTypeAndValue(
		type: string,
		valueUsd: number,
	): Promise<void> {
		const rows = this.gamdomPage.map.getTableRows(
			this.gamdomPage.map.logsTableBody,
		);
		const formattedValue = parseToFloat(valueUsd, 2);

		const found = await rows
			.filter({ hasText: type })
			.filter({ hasText: formattedValue })
			.count();

		expect(
			found,
			buildTransactionTypeAndValueNotFoundMessage(type, formattedValue),
		).toBeGreaterThan(0);
	}

	@step("Verify last transaction contains {expectedTexts}")
	public async verifyLastTransactionContainsTexts(
		expectedTexts: string[],
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.logsTableBody]);

		const detailsColumns =
			await this.gamdomPage.map.logsTableTransactionDetailsColumn.allTextContents();

		expect(
			detailsColumns.length,
			"No transaction details found in the table",
		).toBeGreaterThan(0);

		const lastTransactionDetails = detailsColumns[0];
		const missingTexts = expectedTexts.filter(
			(text) => !lastTransactionDetails.includes(text),
		);

		expect(
			missingTexts,
			`Last transaction details should contain the following texts: ${expectedTexts.join(
				", ",
			)}. Missing: ${missingTexts.join(", ")}`,
		).toHaveLength(0);
	}

	@step("Verify last transaction contains WIN and Round_Closed: true")
	public async lastTransactionContainsWinAndRoundClosed(): Promise<void> {
		await this.verifyLastTransactionContainsTexts([
			TransactionDetailsText.MADE_A_WIN_ON_GAME,
			TransactionDetailsText.ROUND_CLOSED_TRUE,
		]);
	}

	@step("Verify last transaction contains game code {gameCode}")
	public async lastTransactionContainsGameCode(
		gameCode: string,
	): Promise<void> {
		await this.verifyLastTransactionContainsTexts([gameCode]);
	}
}
