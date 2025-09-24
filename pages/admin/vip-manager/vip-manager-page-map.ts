import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class VipManagerAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get vipManagerPageContent(): Locator {
		return this.page.getByTestId(`vip-manager-page`);
	}

	public get vipManagerPageTitle(): Locator {
		return this.vipManagerPageContent.getByTestId(`vip-manager-title`);
	}

	public get vipPlayersBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(`vip-users-table-card`);
	}

	public get vipManagerActionButtonsContainer(): Locator {
		return this.vipManagerPageContent.getByTestId(
			`vip-manager-actions-box`,
		);
	}

	public get addVipStatusButton(): Locator {
		return this.vipManagerActionButtonsContainer.getByTestId(
			`add-vip-status-button`,
		);
	}

	public get batchUpdateButton(): Locator {
		return this.vipManagerActionButtonsContainer.getByTestId(
			`batch-update-button`,
		);
	}

	public get changeTelegramSettingsButton(): Locator {
		return this.vipManagerActionButtonsContainer.getByTestId(
			`change-telegram-settings-button`,
		);
	}

	public get sendUserNotificationBlock(): Locator {
		return this.vipManagerPageContent.getByTestId(
			"sendNotificationsContainer",
		);
	}

	public get addVipPlayerStatusBlock(): Locator {
		return this.page
			.getByTestId("add-vip-status-dialog")
			.getByRole("dialog");
	}

	public get batchUpdateVipPlayersStatusBlock(): Locator {
		return this.page
			.getByTestId("batch-vip-status-update-dialog")
			.getByRole("dialog");
	}

	public get batchUpdateVipPlayersStatusAccessDeniedBlock(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.getByTestId(
			"batch-vip-status-update-no-access",
		);
	}

	public get changeTelegramNotificationSettingsBlock(): Locator {
		return this.page
			.getByTestId("telegram-notifications-settings-dialog")
			.getByRole("dialog");
	}

	public get updateBachVipStatusDialogContent(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.getByTestId(
			"batch-vip-status-update-dialog-content",
		);
	}

	public get inputBatchUpdateVipPlayersStatus(): Locator {
		return this.updateBachVipStatusDialogContent.locator(
			`//input[@type='file']//parent::div`,
		);
	}

	public get uploadBatchUpdateVipPlayersStatusFileButton(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.getByTestId(
			"batch-vip-status-update-upload-button",
		);
	}

	public get inputFileUpdateRemoveBatchVipPlayers(): Locator {
		return this.updateBachVipStatusDialogContent.locator(`input`);
	}

	public get batchVipStatusErrorLogsTextarea(): Locator {
		return this.updateBachVipStatusDialogContent.locator(
			`//span[contains(., "Error Logs")]//parent::div//following-sibling::div//textarea[not(@aria-hidden='true')]`,
		);
	}

	public get batchVipPlayersStatusButtonsContainer(): Locator {
		return this.batchUpdateVipPlayersStatusBlock.getByTestId(
			`batch-vip-status-update-mode-toggle`,
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
