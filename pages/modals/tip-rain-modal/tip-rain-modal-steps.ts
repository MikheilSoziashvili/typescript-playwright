import { BasePageStep } from "@pages/base/base-page-step";
import { TipRainModal } from "./tip-rain-modal";

export class TipRainModalSteps extends BasePageStep<TipRainModal> {
	public constructor(page: TipRainModal) {
		super(page);
	}

	public async tipRainSuccessfully(value: number): Promise<void> {
		await this.gamdomPage.tipRainValue(value);
		await this.gamdomPage.assertThat().isNotDisplayed();
	}

	public async verifyModalAndTipRainSuccessfully(
		value: number,
	): Promise<void> {
		await this.gamdomPage.assertThat().isDisplayed();
		await this.tipRainSuccessfully(value);
	}
}
