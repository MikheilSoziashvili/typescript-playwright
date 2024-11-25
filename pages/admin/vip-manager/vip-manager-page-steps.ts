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

	@step()
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

	@step()
	public async toggleUploadRemoveBatchVipPlayersByOption(
		bulkActionOption: BulkActions,
	): Promise<void> {
		const uploadRemoveButton =
			bulkActionOption === BulkActions.UPLOAD
				? this.gamdomPage.map.updateBatchVipPlayersStatusButton
				: this.gamdomPage.map.removeBatchVipPlayersStatusButton;

		await this.toggleUpdateRemoveBatchVipPlayers(uploadRemoveButton);
	}
}
