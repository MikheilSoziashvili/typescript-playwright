import { BasePageStep } from "@pages/base/base-page-step";
import { SoftblockModalPage } from "./softblock-modal";

export class SoftblockModalSteps extends BasePageStep<SoftblockModalPage> {
	public constructor(page: SoftblockModalPage) {
		super(page);
	}

	public async closeSoftblockModal(): Promise<void> {
		await this.gamdomPage.map.softblockModalCloseButton.click();
	}
}
