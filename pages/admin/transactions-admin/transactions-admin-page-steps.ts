import { BasePageStep } from "@pages/base/base-page-step";
import { TransactionsAdminPage } from "./transactions-admin-page";
import { LogType } from "@enums/log-types";
import { step } from "decorators/step";

export class TransactionsAdminPageSteps extends BasePageStep<TransactionsAdminPage> {
	public constructor(gamdomPage: TransactionsAdminPage) {
		super(gamdomPage);
	}

	@step("Select log types to fetch")
	public async filterAndVerifyLogTypes(
		logTypes: LogType[],
		expectedLogTypeValues: string[],
		clearLogTypeFilters: boolean,
	): Promise<void> {
		for (const logType of logTypes) {
			await this.gamdomPage.selectLogTypesToFetch(logType);
		}
		await this.gamdomPage.clickFetchData();
		await this.gamdomPage
			.assertThat()
			.verifyLogsTableTransactionDetailsColumnValues(
				expectedLogTypeValues,
			);

		if (clearLogTypeFilters) {
			await this.gamdomPage.clearLogTypesFieldInput();
		}
	}
}
