import { PromoCampaignStatusActions } from "@enums/campaign-actions";
import { PromoCampaignStatuses } from "@enums/campaign-statuses";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { PromoCampaignsAdminPage } from "./promo-campaigns-admin-page";

export class PromoCampaignsAdminSteps extends BasePageStep<PromoCampaignsAdminPage> {
	public constructor(page: PromoCampaignsAdminPage) {
		super(page);
	}

	@step("Change promo campaign status and verify new status in the table")
	public async changePromoCampaignStatus(
		promoCampaignName: string,
		newStatus:
			| PromoCampaignStatusActions
			| keyof typeof PromoCampaignStatusActions,
	): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.campaignIsDisplayedInCampaignsTable(promoCampaignName);
		switch (newStatus) {
			case PromoCampaignStatusActions.ACTIVATE: {
				await this.gamdomPage.map
					.activateCampaignButtonTableByCampaignName(
						promoCampaignName,
					)
					.click();
				await this.gamdomPage
					.assertThat()
					.verifyPromoCampaignStatus(
						promoCampaignName,
						PromoCampaignStatuses.ACTIVE,
					);
				break;
			}
			case PromoCampaignStatusActions.PAUSE: {
				await this.gamdomPage.map
					.pauseCampaignButtonTableByCampaignName(promoCampaignName)
					.click();
				await this.gamdomPage
					.assertThat()
					.verifyPromoCampaignStatus(
						promoCampaignName,
						PromoCampaignStatuses.PAUSED,
					);
				break;
			}
			case PromoCampaignStatusActions.CANCEL: {
				await this.gamdomPage.map
					.cancelCampaignButtonTableByCampaignName(promoCampaignName)
					.click();
				await this.gamdomPage
					.assertThat()
					.verifyPromoCampaignStatus(
						promoCampaignName,
						PromoCampaignStatuses.CANCELED,
					);
				break;
			}
			case PromoCampaignStatusActions.FINISH: {
				await this.gamdomPage.map
					.pauseCampaignButtonTableByCampaignName(promoCampaignName)
					.click();
				await this.gamdomPage.map
					.finishCampaignButtonTableByCampaignName(promoCampaignName)
					.click();
				await this.gamdomPage
					.assertThat()
					.verifyPromoCampaignStatus(
						promoCampaignName,
						PromoCampaignStatuses.FINISHED,
					);
				break;
			}
			default:
				throw new Error(`Unknown status action: ${newStatus}`);
		}
	}

	@step("Search for a promo code exact match in the campaigns table")
	public async searchPromoCode(
		campaignCode: string,
		campaignName: string,
		numberOfResults: number,
	): Promise<void> {
		await this.gamdomPage.map.searchPromoCodeInputField.fill(campaignCode);
		await this.gamdomPage.searchPromoCode();
		await this.gamdomPage.map.waitForVisibility({
			locator: this.gamdomPage.map.clearButton,
		});
		await this.gamdomPage
			.assertThat()
			.campaignIsDisplayedInCampaignsTable(campaignName);
		await this.gamdomPage
			.assertThat()
			.verifyNumberOfSearchResults(campaignName, numberOfResults);
	}

	@step("Search for a non-existing promo code in the campaigns table")
	public async searchForNonExistingPromoCode(
		campaignCode: string,
		appendToCode: string,
	): Promise<void> {
		await this.gamdomPage.map.searchPromoCodeInputField.fill(campaignCode + appendToCode);
		await this.gamdomPage.searchPromoCode();
	}

	@step("Clear search input field")
	public async clearSearchInputField(): Promise<void> {
		await this.gamdomPage.clearSearchInputField();
		await this.gamdomPage
			.assertThat()
			.verifySearchInputIsCleared();
		await this.gamdomPage
			.assertThat()
			.verifyTableIsNotEmpty();
	}
}
