import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class VipManagerAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public blocksByPlaceholder(placeholderText: string): Locator {
		return this.page.locator(
			`//h4[contains(@class,'title') and normalize-space()='${placeholderText}']//ancestor::div[contains(@class,'aff_col')]`,
		);
	}

	public get vipPlayersBlock(): Locator {
		return this.blocksByPlaceholder("VIP Players");
	}

	public get sendUserNotificationBlock(): Locator {
		return this.blocksByPlaceholder("Send user notification");
	}

	public get addVipPlayerStatusBlock(): Locator {
		return this.blocksByPlaceholder("Add VIP player status");
	}

	public get batchUpdateVipPlayersStatusBlock(): Locator {
		return this.blocksByPlaceholder("BATCH UPDATE VIP PLAYERS STATUS");
	}

	public get changeTelegramNotificationSettingsBlock(): Locator {
		return this.blocksByPlaceholder(
			"CHANGE TELEGRAM NOTIFICATION SETTINGS",
		);
	}

	public get inputBatchUpdateVipPlayersStatus(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//input[@type='file']//parent::div`,
		);
	}

	public get uploadBatchUpdateVipPlayersStatusFileButton(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//button[normalize-space()='Upload']`,
		);
	}

	public get inputFileUpdateRemoveBatchVipPlayers(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//input[@type='file']`,
		);
	}

	private getBatchVipPlayersStatusButton(buttonLabel: string): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//button[normalize-space()='${buttonLabel}']`,
		);
	}

	public get updateBatchVipPlayersStatusButton(): Locator {
		return this.getBatchVipPlayersStatusButton("Update");
	}

	public get removeBatchVipPlayersStatusButton(): Locator {
		return this.getBatchVipPlayersStatusButton("Remove");
	}
}
