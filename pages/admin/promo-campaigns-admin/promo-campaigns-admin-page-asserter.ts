import { BaseAsserter } from "@pages/base/base-asserter";
import { PromoCampaignsAdminPage } from "./promo-campaigns-admin-page";
import { step } from "decorators/step";
import { PromoCampaignStatuses } from "@enums/campaign-statuses";
import { expect } from "@playwright/test";

export class PromoCampaignsAdminAsserter extends BaseAsserter<PromoCampaignsAdminPage> {
	public constructor(page: PromoCampaignsAdminPage) {
		super(page);
	}

	@step("Verify that the promo campaign is displayed in the campaigns table")
	public async campaignIsDisplayedInCampaignsTable(
		campaignName: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.tableRowByCampaignName(campaignName),
		]);
	}

	@step("Verify promo campaign status in the campaigns table")
	public async verifyPromoCampaignStatus(
		promoCampaignName: string,
		expectedCampaignStatus: PromoCampaignStatuses,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.campaignStatusTableLabelByCampaignName(
				promoCampaignName,
			),
		).toHaveText(expectedCampaignStatus);
	}
}
