import { BasePage } from "@base/base-page";
import { step } from "decorators/step";
import { Page } from "@playwright/test";
import { UserInfoTransactionsAdminPageAsserter } from "./user-info-transactions-admin-page-asserter";
import { UserInfoTransactionsAdminPageMap } from "./user-info-transactions-admin-page-map";
import { UserInfoTransactionsAdminPageSteps } from "./user-info-transactions-admin-page-steps";
import { LogType } from "@enums/log-types";
import { TransactionDetails } from "@core/interfaces";

export class UserInfoTransactionsAdminPage extends BasePage<UserInfoTransactionsAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoTransactionsAdminPageMap(page));
	}

	public override assertThat(): UserInfoTransactionsAdminPageAsserter {
		return new UserInfoTransactionsAdminPageAsserter(this);
	}

	public steps(): UserInfoTransactionsAdminPageSteps {
		return new UserInfoTransactionsAdminPageSteps(this);
	}

	@step("Navigate to admin user transactions page")
	public async navigateToAdminUserTransactionsPage(): Promise<void> {
		await this.map.transactionsNavigationTabsButton.click();
	}

	@step("Select log types to fetch")
	public async selectLogTypesToFetch(logType: LogType): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.logTypesToFetchFieldInput,
		});
		await this.map.logTypesToFetchFieldContainer.click();
		await this.map.logTypesToFetchFieldInput.fill(logType);
		await this.pressEnterKeyboard();
	}

	@step("Click fetch data")
	public async clickFetchData(): Promise<void> {
		await this.map.fetchWithDateButton.click();
	}

	@step("Clear log types field input")
	public async clearLogTypesFieldInput(): Promise<void> {
		await this.map.clearLogTypesButton.click();
	}

	@step("Check the stats calculation box")
	public async checkStatsCalculationBox(): Promise<void> {
		await this.map.statsCalculationCheckbox.check();
	}

	@step(
		"Click transaction details for a transaction with present balance value",
	)
	public async clickDetailsForTransactionWithBalance(
		type: string,
	): Promise<void> {
		const row = await this.map.getRowByTypeWithBalance(type.toLowerCase());
		const detailsButton = this.map.getDetailsButtonInRow(row);
		await detailsButton.click();
	}

	@step("Get transaction details text")
	public async getTransactionDetailsText(): Promise<string> {
		return (await this.map.transactionDetailContent.textContent()) || "";
	}

	@step("Get transaction details object content")
	public async getTransactionDetails(): Promise<TransactionDetails> {
		const detailsText = await this.getTransactionDetailsText();
		try {
			const detailsJson: unknown = JSON.parse(detailsText);
			return detailsJson as TransactionDetails;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to parse transaction details JSON: ${errorMessage}`,
			);
		}
	}

	@step("Get transaction details for a certain field from object")
	public async getTransactionDetailField<T>(fieldName: string): Promise<T> {
		const details = await this.getTransactionDetails();
		return details[fieldName] as T;
	}
}
