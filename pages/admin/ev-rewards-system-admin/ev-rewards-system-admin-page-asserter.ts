import { EXPECTED_TOAST_BY_KEY } from "@constants/ev-reward-toast";
import { FileKey } from "@core/types/types";
import { ExpectedResultLogsKey } from "@enums/expected-reward-logs";
import { ExpectedResultToastKey } from "@enums/expected-reward-toast-keys";
import { Timeout } from "@enums/timeout";
import { BaseAsserter } from "@pages/base/base-asserter";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { EvRewardsSystemAdminPage } from "./ev-rewards-system-admin-page";
import { EvRewardFileKeys } from "@enums/ev-reward-file-keys";

export class EvRewardsSystemAdminAsserter extends BaseAsserter<EvRewardsSystemAdminPage> {
	public constructor(page: EvRewardsSystemAdminPage) {
		super(page);
	}

	@step("Check reward type elements are visible")
	public async rewardTypeElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.rewardTypeLabel,
			this.gamdomPage.map.emptyRewardTypeDetailsText,
		]);
	}

	@step("Check free spins promotion type elements are visible")
	public async freeSpinsPromotionElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.rewardAvailableAfterDateInput,
			this.gamdomPage.map.rewardExpiresAfterDateInput,
			this.gamdomPage.map.freeSpinsPromotionTypeDetailsText,
		]);
	}

	@step("Assert the expected toast messages")
	public async expectToastByFileKey(
		resultKey: ExpectedResultToastKey,
		fileKey: FileKey,
	): Promise<void> {
		const timeout =
			fileKey === EvRewardFileKeys.THOUSAND_PASS
				? Timeout.EXTRA_MAX
				: Timeout.LONG;
		const { title, subtitle } = EXPECTED_TOAST_BY_KEY[resultKey];

		await this.checkElementsAreVisible(
			[
				this.gamdomPage.page.getByText(title, { exact: true }),
				this.gamdomPage.page.getByText(subtitle, { exact: true }),
			],
			timeout,
		);
	}

	@step("Assert logs")
	public async assertLogs(logsKey: ExpectedResultLogsKey): Promise<void> {
		const success = this.gamdomPage.map.successLogsTextarea;
		const error = this.gamdomPage.map.errorLogsTextarea;

		switch (logsKey) {
			case ExpectedResultLogsKey.NONE:
				await this.checkElementsAreEmpty([success, error]);
				return;
			case ExpectedResultLogsKey.SUCCESS:
				await this.checkElementsAreNotEmpty([success]);
				await this.checkElementsAreEmpty([error]);
				return;
			default:
				await this.checkElementsAreNotEmpty([success, error]);
		}
	}

	@step("Assert balance after (with or without payout)")
	public async finalBalanceIsCorrect(
		balanceBefore: number,
		payout: number,
		balanceAfter: number,
		shouldDeduct: boolean,
	): Promise<void> {
		expect(balanceAfter).toBe(shouldDeduct ? balanceBefore - payout : balanceBefore);
	}
}
