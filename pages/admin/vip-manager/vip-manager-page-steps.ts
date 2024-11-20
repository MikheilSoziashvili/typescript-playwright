import { BasePageStep } from "@pages/base/base-page-step";
import { VipManagerAdminPage } from "./vip-manager-page";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Locator } from "@playwright/test";

export class VipManagerAdminPageSteps extends BasePageStep<VipManagerAdminPage> {
	public constructor(gamdomPage: VipManagerAdminPage) {
		super(gamdomPage);
	}

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
}
