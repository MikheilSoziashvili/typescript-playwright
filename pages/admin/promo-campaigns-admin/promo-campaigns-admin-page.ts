import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { PromoCampaignsAdminAsserter } from "./promo-campaigns-admin-page-asserter";
import { PromoCampaignsAdminMap } from "./promo-campaigns-admin-page-map";
import { PromoCampaignsAdminSteps } from "./promo-campaigns-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { PROMO_CAMPAIGNS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";

export class PromoCampaignsAdminPage extends BasePage<PromoCampaignsAdminMap> {
	public constructor(page: Page) {
		super(page, new PromoCampaignsAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PROMO_CAMPAIGNS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): PromoCampaignsAdminAsserter {
		return new PromoCampaignsAdminAsserter(this);
	}

	public steps(): PromoCampaignsAdminSteps {
		return new PromoCampaignsAdminSteps(this);
	}

	@step("Click create campaign button")
	public async clickCreateCampaignButton(): Promise<void> {
		await this.map.newPromoCodeButton.click({ timeout: Timeout.MAX });
	}

	@step("Search for a promo code")
	public async searchPromoCode(): Promise<void> {
		await this.map.searchButton.click();
	}

	@step("Clear search input field")
	public async clearSearchInputField(): Promise<void> {
		await this.map.clearButton.click();
	}

	@step("Click copy code button by the campaign name")
	public async clickCopyCodeButtonByName(
		campaignName: string,
	): Promise<void> {
		await this.map.copyCodeButtonInRow(campaignName).click();
	}

	@step("Click copy link button by the campaign name")
	public async clickCopyLinkButtonByName(
		campaignName: string,
	): Promise<void> {
		await this.map.copyLinkButtonInRow(campaignName).click();
	}

	@step("Click action button by the campaign name")
	public async clickActionButton(
		campaignName: string,
		action: string,
	): Promise<void> {
		await this.map
			.campaignStatusActionButtonTableByCampaignName(campaignName, action)
			.click();
	}
}
