import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { TransactionsAdminPageAsserter } from "./transactions-admin-page-asserter";
import { TransactionsAdminPageMap } from "./transactions-admin-page-map";
import { TransactionsAdminPageSteps } from "./transactions-admin-page-steps";
import { LogType } from "@enums/log-types";

export class TransactionsAdminPage extends BasePage<TransactionsAdminPageMap> {
	public constructor(page: Page) {
		super(page, new TransactionsAdminPageMap(page));
	}

	public override assertThat(): TransactionsAdminPageAsserter {
		return new TransactionsAdminPageAsserter(this);
	}

	public steps(): TransactionsAdminPageSteps {
		return new TransactionsAdminPageSteps(this);
	}

	public async navigateToAdminUserTransactionsPage(): Promise<void> {
		await this.map.transactionsNavigationTabsButton.click();
	}

	public async selectLogTypesToFetch(logType: LogType): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.logTypesToFetchFieldInput,
		});
		await this.map.logTypesToFetchFieldContainer.click();
		await this.map.logTypesToFetchFieldInput.fill(logType);
		await this.pressEnterKeyboard();
	}

	public async clickFetchData(): Promise<void> {
		await this.map.fetchWithDateButton.click();
	}

	public async clearLogTypesFieldInput(): Promise<void> {
		await this.map.clearLogTypesButton.click();
	}
}
