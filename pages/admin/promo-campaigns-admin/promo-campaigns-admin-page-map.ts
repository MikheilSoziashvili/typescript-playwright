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
		return this.promoCampaignsContainer.getByPlaceholder(
			"Search Promo Code",
		);
	}

	public get searchButton(): Locator {
		return this.promoCampaignsContainer.locator("button", {
			hasText: "Search",
		});
	}

	public get clearButton(): Locator {
		return this.promoCampaignsContainer.locator("button", {
			hasText: "Clear",
		});
	}

	public get promoCampaignsTable(): Locator {
		return this.promoCampaignsContainer.getByTestId("promoCampaignsTable");
	}

	public get promoCampaignsTableBody(): Locator {
		return this.promoCampaignsTable.getByTestId("promoCampaignsTableBody");
	}

	public get promoCampaignsTableRows(): Locator {
		return this.promoCampaignsTableBody.locator(
			'[data-testid^="promoCampaignsTableRow"]',
		);
	}

	public tableRowByCampaignName(campaignName: string): Locator {
		return this.promoCampaignsTableBody
			.locator('[data-testid^="promoCampaignsTableRow"]')
			.filter({ hasText: campaignName });
	}

	public campaignStatusTableLabelByCampaignName(
		campaignName: string,
	): Locator {
		return this.tableRowByCampaignName(campaignName).locator(
			'[data-testid^="status-text"]',
		);
	}

	public promoCodeTableText(): Locator {
		return this.promoCampaignsTableRows.locator(`//td[2]//p`);
	}

	public campaignNameTableTextByCampaignName(campaignName: string): Locator {
		return this.tableRowByCampaignName(campaignName).locator(
			'[data-testid^="campaign-name-text"]',
		);
	}

	public campaignActionsButtonTableCellByCampaignName(
		campaignName: string,
	): Locator {
		return this.tableRowByCampaignName(campaignName).locator(
			`[data-testid^="actions-row"]`,
		);
	}

	public campaignStatusActionButtonTableByCampaignName(
		campaignName: string,
		action: string,
	): Locator {
		return this.campaignActionsButtonTableCellByCampaignName(
			campaignName,
		).locator(`[data-testid*='${action}-action-row']`);
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

	public copyActionsContainerByName(campaignName: string): Locator {
		return this.tableRowByCampaignName(campaignName).locator(
			'div[class*="PromoCampaigns-styled__CopyActionsContainer"]',
		);
	}

	private getCopyActionButton(campaignName: string, index: number): Locator {
		return this.copyActionsContainerByName(campaignName)
			.locator('div[class*="StyledIcon"]')
			.nth(index);
	}

	public copyCodeButtonInRow(campaignName: string): Locator {
		return this.getCopyActionButton(campaignName, 0);
	}

	public copyLinkButtonInRow(campaignName: string): Locator {
		return this.getCopyActionButton(campaignName, 1);
	}

	public get noDataCell(): Locator {
		return this.promoCampaignsTableBody.getByTestId("noDataCell");
	}
}
