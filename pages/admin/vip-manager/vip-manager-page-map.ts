import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class VipManagerAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get vipManagerPageContent(): Locator {
		return this.page.getByTestId("vipManagerPageContent");
	}

	public get vipPlayersBlock(): Locator {
		return this.vipManagerPageContent.getByTestId("vipPlayersContainer");
	}

	public get sendUserNotificationBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(
			"sendNotificationsContainer",
		);
	}

	public get addVipPlayerStatusBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(
			"addVipPlayersStatusContainer",
		);
	}

	public get batchUpdateVipPlayersStatusBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(
			"batchUpdateVipPlayersStatusContainer",
		);
	}

	public get changeTelegramNotificationSettingsBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(
			"changeTelegramNotificationsSettingsContainer",
		);
	}

	public get inputBatchUpdateVipPlayersStatus(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(
			`//input[@type='file']//parent::div`,
		);
	}

	public get uploadBatchUpdateVipPlayersStatusFileButton(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.getByTestId(
			"uploadButton",
		);
	}

	public get inputFileUpdateRemoveBatchVipPlayers(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.locator(`input`);
	}

	public get batchVipPlayersStatusButtonsContainer(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.getByTestId(
			"updateRemoveButtonsContainer",
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
