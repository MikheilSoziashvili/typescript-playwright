import { BaseAsserter } from "@pages/base/base-asserter";
import { Locator } from "@playwright/test";
import { step } from "decorators/step";
import { BulkActionsAdminPage } from "./bulk-actions-admin-page";

export class BulkActionsAdminAsserter extends BaseAsserter<BulkActionsAdminPage> {
	public constructor(page: BulkActionsAdminPage) {
		super(page);
	}

	@step("Send notification button is disabled")
	public async sendNotificationButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.processNotificationsButton,
		]);
	}

	@step("Send notification button is еnabled")
	public async sendNotificationButtonIsEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.processNotificationsButton,
		]);
	}
	@step("Verify that success logs contain specified user IDs")
	public async successLogsContainUserIds(userIds: string[]): Promise<void> {
		await this.verifyLogsContainUserIds(
			userIds,
			this.gamdomPage.map.successLogs,
		);
	}

	@step("Verify that error logs contain specified user IDs")
	public async errorLogsContainUserIds(userIds: string[]): Promise<void> {
		await this.verifyLogsContainUserIds(
			userIds,
			this.gamdomPage.map.errorLogs,
		);
	}

	@step("Verify that summary matches total amount and total users")
	public async summaryIs(summary: { totalUsd: number; totalUsers: number }): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.summaryTotalUsd,
				expectedText: summary.totalUsd.toString(),
			},
			{
				locator: this.gamdomPage.map.summaryTotalUsers,
				expectedText: summary.totalUsers.toString(),
			},
		]);
	}

	@step("Verify that logs contain specified user IDs")
	private async verifyLogsContainUserIds(
		userIds: string[],
		logsLocator: Locator,
	): Promise<void> {
		for (const userId of userIds) {
			await this.checkElementsContainText([
				{
					locator: logsLocator,
					expectedText: userId,
				},
			]);
		}
	}
}
