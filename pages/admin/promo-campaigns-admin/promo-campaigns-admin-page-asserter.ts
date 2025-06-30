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

	@step("Verify promo code exact match in the campaigns table")
	public async verifyPromoCodeExactMatch(
		promoCode: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.promoCodeTableText(),
		).toHaveText(promoCode);
	}

	@step("Verify the number of search results in the campaigns table")
	public async verifyNumberOfSearchResults(
		promoCampaignName: string,
		numberOfResults: number,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.tableRowByCampaignName(promoCampaignName),
		).toHaveCount(numberOfResults);
	}

	@step("Verify the table is not empty")
	public async verifyTableIsNotEmpty(): Promise<void> {
		await expect(this.gamdomPage.map.promoCampaignsTableRows).not.toHaveCount(0);
	}

	@step("Verify search input is cleared")
	public async verifySearchInputIsCleared(): Promise<void> {
		await expect(this.gamdomPage.map.searchPromoCodeInputField).toBeEmpty();
	}

	@step("Verify search input is not cleared")
	public async verifySearchInputIsNotCleared(promoCode: string): Promise<void> {
		await expect(this.gamdomPage.map.searchPromoCodeInputField).toHaveValue(promoCode);

	}
}
