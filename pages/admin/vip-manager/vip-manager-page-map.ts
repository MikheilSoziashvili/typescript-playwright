import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class VipManagerAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get vipManagerPageContent(): Locator {
		return this.page.locator(`[class*="MuiContainer-root"]`);
	}

	public get vipManagerPageTitle(): Locator {
		return this.page.locator(`h3[class*="MuiTypography-root"]`);
	}

	public get vipPlayersBlock(): Locator {
		return this.vipManagerPageContent.locator(
			`[class*=MuiPaper-elevation]`,
		);
	}

	public get addVipStatusButton(): Locator {
		return this.page.locator(
			`//button[@type='button' and text()='Add VIP status']`,
		);
	}

	public get batchUpdateButton(): Locator {
		return this.page.locator(
			`//button[@type='button' and text()='Batch update']`,
		);
	}

	public get changeTelegramSettingsButton(): Locator {
		return this.page.locator(
			`//button[@type='button' and text()='Change Telegram settings']`,
		);
	}

	public get sendUserNotificationBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(
			"sendNotificationsContainer",
		);
	}

	public get addVipPlayerStatusBlock(): Locator {
		return this.page.locator(
			"//h2[contains(@class,'MuiDialogTitle-root') and text()='Add VIP Status']//ancestor::div[contains(@class,'MuiDialog-paper')]",
		);
	}

	public get batchUpdateVipPlayersStatusBlock(): Locator {
		return this.page.locator(
			`//h2[contains(@class,'MuiDialogTitle-root') and text()='Batch Update VIP players status']//ancestor::div[contains(@class,'MuiDialog-paper')]`,
		);
	}

	public get batchUpdateVipPlayersStatusAccessDeniedBlock(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(`p`, {
			hasText: "You don't have access to this feature",
		});
	}

	public get changeTelegramNotificationSettingsBlock(): Locator {
		return this.page.locator(
			`//h2[contains(@class,'MuiDialogTitle-root') and text()='Telegram Notifications Settings']//ancestor::div[contains(@class,'MuiDialog-paper')]`,
		);
	}

	public get inputBatchUpdateVipPlayersStatus(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//input[@type='file']//parent::div`,
		);
	}

	public get uploadBatchUpdateVipPlayersStatusFileButton(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			"//button[@type='button' and text()='Upload']",
		);
	}

	public get inputFileUpdateRemoveBatchVipPlayers(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(`input`);
	}

	public get batchVipPlayersStatusButtonsContainer(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//div[@role="group"]`,
		);
	}

	private getBatchVipPlayersStatusButton(buttonLabel: string): Locator {
		return this.batchVipPlayersStatusButtonsContainer.locator(
			`button[value='${buttonLabel}']`,
		);
	}

	public get updateBatchVipPlayersStatusButton(): Locator {
		return this.getBatchVipPlayersStatusButton("update");
	}

	public get removeBatchVipPlayersStatusButton(): Locator {
		return this.getBatchVipPlayersStatusButton("remove");
	}
}
