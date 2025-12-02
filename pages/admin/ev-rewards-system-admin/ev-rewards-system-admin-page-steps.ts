import { EV_REWARD_FREE_SPINS_FILE_MAP } from "@constants/file-paths";
import { FileKey } from "@core/types/types";
import {
	computePayoutFromCsv,
	parseUserIdsFromSuccessLogs,
} from "@core/utils/csv-utils/generating-reward-csv-utils";
import { EvRewardTypes } from "@enums/ev-reward-types";
import { ExpectedResultToastKey } from "@enums/expected-reward-toast-keys";
import { RelativeDateRelation } from "@enums/relative-date-relation";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { EvRewardsSystemAdminPage } from "./ev-rewards-system-admin-page";

export class EvRewardsSystemAdminSteps extends BasePageStep<EvRewardsSystemAdminPage> {
	private static readonly DEFAULT_RELATIVE_DAYS = 2;
	private static readonly FUTURE_MIN_GAP = 1;

	public constructor(page: EvRewardsSystemAdminPage) {
		super(page);
	}

	@step("Compute relation offset based on past/future")
	private async relationToOffset(
		rel: RelativeDateRelation,
		days: number = EvRewardsSystemAdminSteps.DEFAULT_RELATIVE_DAYS,
	): Promise<number> {
		return rel === RelativeDateRelation.FUTURE ? days : -days;
	}

	@step("Navigate and check rewards type elements")
	public async navigateAndCheckRewardTypeElements(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().rewardTypeElementsAreVisible();
	}

	@step("Select free spins promotion type and check elements")
	public async selectFreeSpinsAndCheckElements(): Promise<void> {
		await this.gamdomPage.map.evRewardOption.click();
		await this.gamdomPage.map
			.pickRewardTypeFromDropdown(EvRewardTypes.FREE_SPINS_PROMOTION)
			.click();
		await this.gamdomPage
			.assertThat()
			.freeSpinsPromotionElementsAreVisible();
	}

	@step("Pick start date: N days relative to today (calendar)")
	public async pickStartDate(daysOffset: number): Promise<void> {
		await this.gamdomPage.datepicker.pickDateRelativeIn(
			this.gamdomPage.map.rewardAvailableAfterDateInput,
			daysOffset,
		);
	}

	@step("Pick end date: N days relative to today (calendar)")
	public async pickEndDate(daysOffset: number): Promise<void> {
		await this.gamdomPage.datepicker.pickDateRelativeIn(
			this.gamdomPage.map.rewardExpiresAfterDateInput,
			daysOffset,
		);
	}

	@step("Pick start date based on past/future time")
	public async pickStartDateByRelation(
		relation: RelativeDateRelation,
	): Promise<void> {
		const offset = await this.relationToOffset(relation);
		await this.pickStartDate(offset);
	}

	@step("Pick end date based on past/future time")
	public async pickEndDateByRelation(
		relation: RelativeDateRelation,
	): Promise<void> {
		const offset = await this.relationToOffset(relation);
		await this.pickEndDate(offset);
	}
	/**
	 * Pick both start & end dates from CSV relations without conditionals in the test.
	 * Rule: if both are "future", ensure end > start by at least 1 day within the current grid.
	 */
	@step("Pick start & end dates based on relations from CSV (order-safe)")
	public async pickDatesByRelations(
		startRelation: RelativeDateRelation,
		endRelation: RelativeDateRelation,
	): Promise<void> {
		const startOffset = await this.relationToOffset(startRelation);
		let endOffset = await this.relationToOffset(endRelation);

		if (startOffset >= 0 && endOffset >= 0 && endOffset <= startOffset) {
			endOffset = startOffset + EvRewardsSystemAdminSteps.FUTURE_MIN_GAP;
		}

		await this.pickStartDate(startOffset);
		await this.pickEndDate(endOffset);
	}

	@step("Resolve upload csv path")
	public async resolveUploadPath(
		fileKey: FileKey,
		dynamicMap: Partial<Record<FileKey, string>>,
	): Promise<string> {
		return dynamicMap[fileKey] ?? EV_REWARD_FREE_SPINS_FILE_MAP[fileKey];
	}

	@step("Compute payout from CSV for users in success logs")
	public async computePayoutForSuccessLogs(
		uploadPath: string,
	): Promise<number> {
		const logsText =
			await this.gamdomPage.map.successLogsTextarea.inputValue();
		const rewardedUserIds = parseUserIdsFromSuccessLogs(logsText);
		return computePayoutFromCsv(uploadPath, {
			filterUserIds: rewardedUserIds,
		});
	}

	@step("Compute payout for current case based on expected result")
	public async computePayoutForCase(
		uploadPath: string,
		resultKey: ExpectedResultToastKey,
	): Promise<number> {
		if (resultKey === ExpectedResultToastKey.PROCESSED_OK) {
			return this.computePayoutForSuccessLogs(uploadPath);
		}
		return 0;
	}

	@step("Determine if balance should be deducted based on result")
	public async shouldDeductBalance(
		resultKey: ExpectedResultToastKey,
	): Promise<boolean> {
		return resultKey === ExpectedResultToastKey.PROCESSED_OK;
	}

	@step("Set conditions for free spins reward")
	public async setConditionsForFreeSpinsReward(
		startDate: number,
		endDate: number,
	): Promise<void> {
		await this.navigateAndCheckRewardTypeElements();
		await this.selectFreeSpinsAndCheckElements();
		await this.pickStartDate(startDate);
		await this.pickEndDate(endDate);
	}
}
