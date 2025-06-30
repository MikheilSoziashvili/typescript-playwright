import { PromoCampaignStatusActions } from "@enums/campaign-actions";
import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PromoCampaignsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promoCampaignsContainer(): Locator {
		return this.page.getByTestId("promoCampaignsPageContent");
	}

	public get newPromoCodeButton(): Locator {
		return this.promoCampaignsContainer.getByTestId("newPromoCodeButton");
	}

	public get searchPromoCodeInputField(): Locator {
		return this.promoCampaignsContainer.getByPlaceholder("Search Promo Code");
	}

	public get searchButton(): Locator {
		return this.promoCampaignsContainer.locator("button", { hasText: "Search" });
	}

	public get clearButton(): Locator {
		return this.promoCampaignsContainer.locator("button", { hasText: "Clear" });
	}

	public get promoCampaignsTable(): Locator {
		return this.promoCampaignsContainer.locator(`table`);
	}

	public get promoCampaignsTableBody(): Locator {
		return this.promoCampaignsTable.locator(`tbody`);
	}

	public get promoCampaignsTableRows(): Locator {
		return this.promoCampaignsTableBody.locator(`tr`);
	}

	public tableRowByCampaignName(campaignName: string): Locator {
		return this.promoCampaignsTableBody.locator(
			`//tr[td[1][normalize-space()= '${campaignName}']]`,
		);
	}

	public campaignStatusTableLabelByCampaignName(
		campaignName: string,
	): Locator {
		return this.tableRowByCampaignName(campaignName).locator(`//td[4]//p`);
	}

	public promoCodeTableText(): Locator {
		return this.promoCampaignsTableRows.locator(`//td[2]//p`);
	}

	public campaignNameTableTextByCampaignName(campaignName: string): Locator {
		return this.tableRowByCampaignName(campaignName).locator(`//td[1]//p`);
	}

	public campaignActionsButtonTableCellByCampaignName(
		campaignName: string,
	): Locator {
		return this.tableRowByCampaignName(campaignName).locator(
			`//td//div[contains(@class,'list_settings')]//div[contains(@class,'StyledStatusActionIconContainer-sc')]`,
		);
	}

	public campaignStatusActionButtonTableByCampaignName(
		campaignName: string,
		action: string,
	): Locator {
		return this.campaignActionsButtonTableCellByCampaignName(
			campaignName,
		).locator(`img[alt='${action}']`);
	}

	public activateCampaignButtonTableByCampaignName(
		campaignName: string,
	): Locator {
		return this.campaignStatusActionButtonTableByCampaignName(
			campaignName,
			PromoCampaignStatusActions.ACTIVATE,
		);
	}

	public finishCampaignButtonTableByCampaignName(
		campaignName: string,
	): Locator {
		return this.campaignStatusActionButtonTableByCampaignName(
			campaignName,
			PromoCampaignStatusActions.FINISH,
		);
	}

	public cancelCampaignButtonTableByCampaignName(
		campaignName: string,
	): Locator {
		return this.campaignStatusActionButtonTableByCampaignName(
			campaignName,
			PromoCampaignStatusActions.CANCEL,
		);
	}

	public pauseCampaignButtonTableByCampaignName(
		campaignName: string,
	): Locator {
		return this.campaignStatusActionButtonTableByCampaignName(
			campaignName,
			PromoCampaignStatusActions.PAUSE,
		);
	}
}
