import { BaseAsserter } from "@base/base-asserter";
import { UserInfoRewardsHistoryAdminPage } from "./user-info-rewards-history-admin-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import { REWARD_HISTORY_TABLE_COLUMNS } from "@constants/rewardHistoryTable";

export class UserInfoRewardsHistoryAdminPageAsserter extends BaseAsserter<UserInfoRewardsHistoryAdminPage> {
	public constructor(page: UserInfoRewardsHistoryAdminPage) {
		super(page);
	}

	@step("Rewards history table is visible")
	public async rewardsHistoryTableVisible(): Promise<void> {
		await expect(this.gamdomPage.map.rewardsHistoryTable).toBeVisible();
	}

	@step("Reward history table columns are visible")
	public async rewardHistoryTableColumnsAreVisible(): Promise<void> {
		for (const column of REWARD_HISTORY_TABLE_COLUMNS) {
			await this.checkElementsAreVisible([
				this.gamdomPage.map.rewardsHistoryTableColumn.filter({
					hasText: column,
				}),
			]);
		}
	}

	@step("Reward status is {status}")
	public async rewardStatusIs(
		source: string,
		type: string,
		value: string,
		status: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.targetRow(source, type),
		]);

		const amountLocator = this.gamdomPage.map.rewardAmountInRow(
			source,
			type,
		);
		await this.checkElementsHaveText([
			{ locator: amountLocator, expectedText: value },
		]);

		const statusLocator = this.gamdomPage.map.rewardStatusInRow(
			source,
			type,
		);
		await this.checkElementsHaveText([
			{ locator: statusLocator, expectedText: status },
		]);
	}
}
