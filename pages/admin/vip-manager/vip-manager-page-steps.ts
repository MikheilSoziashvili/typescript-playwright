import { BasePageStep } from "@pages/base/base-page-step";
import { VipManagerAdminPage } from "./vip-manager-page";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Locator } from "@playwright/test";
import { step } from "decorators/step";
import { BulkActions } from "@enums/bulk-actions";

export class VipManagerAdminPageSteps extends BasePageStep<VipManagerAdminPage> {
	public constructor(gamdomPage: VipManagerAdminPage) {
		super(gamdomPage);
	}

	@step("Toggle update remove batch vip players")
	public async toggleUpdateRemoveBatchVipPlayers(
		updateRemoveButton: Locator,
	): Promise<void> {
		const buttonState = await updateRemoveButton.getAttribute(
			Attributes.ARIA_PRESSED,
		);
		if (buttonState !== BooleanValueString.TRUE) {
			await updateRemoveButton.click();
			await this.gamdomPage.map.waitForAttributeToHaveValue(
				updateRemoveButton,
				Attributes.ARIA_PRESSED,
				BooleanValueString.TRUE,
			);
		}
	}

	@step("Toggle upload remove batch vip players by option")
	public async toggleUploadRemoveBatchVipPlayersByOption(
		bulkActionOption: BulkActions,
	): Promise<void> {
		const uploadRemoveButton =
			bulkActionOption === BulkActions.UPLOAD
				? this.gamdomPage.map.updateBatchVipPlayersStatusButton
				: this.gamdomPage.map.removeBatchVipPlayersStatusButton;

		await this.toggleUpdateRemoveBatchVipPlayers(uploadRemoveButton);
	}

	@step("Open add vip status modal successfully")
	public async openAddVipStatusModalSuccessfully(): Promise<void> {
		await this.gamdomPage.clickAddVipStatusButton();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.addVipPlayerStatusBlock,
			]);
	}

	@step("Open batch update vip players status modal successfully")
	public async openBatchUpdateVipPlayersStatusModalSuccessfully(): Promise<void> {
		await this.gamdomPage.clickBatchUpdateButton();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.batchUpdateVipPlayersStatusBlock,
			]);
	}

	@step("Open change telegram notification settings modal successfully")
	public async openChangeTelegramNotificationSettingsModalSuccessfully(): Promise<void> {
		await this.gamdomPage.clickChangeTelegramSettingsButton();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.changeTelegramNotificationSettingsBlock,
			]);
	}
}
