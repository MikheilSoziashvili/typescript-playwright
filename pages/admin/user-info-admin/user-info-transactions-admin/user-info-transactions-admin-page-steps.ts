import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoTransactionsAdminPage } from "./user-info-transactions-admin-page";
import { LogType } from "@enums/log-types";
import { step } from "decorators/step";

export class UserInfoTransactionsAdminPageSteps extends BasePageStep<UserInfoTransactionsAdminPage> {
	public constructor(gamdomPage: UserInfoTransactionsAdminPage) {
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

	@step("Select log types only")
	public async selectLogTypesOnly(logTypes: LogType[]): Promise<void> {
		for (const logType of logTypes) {
			await this.gamdomPage.selectLogTypesToFetch(logType);
		}
	}

	@step("Select Stats calculations and fetch data")
	public async fetchStatsCalculationsData(): Promise<void> {
		await this.gamdomPage.checkStatsCalculationBox();
		await this.gamdomPage.clickFetchData();
	}
}
