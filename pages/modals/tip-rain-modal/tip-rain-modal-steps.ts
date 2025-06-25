import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { TipRainModal } from "./tip-rain-modal";
import { GamdomApi } from "@api/gamdom-api";

export class TipRainModalSteps extends BasePageStep<TipRainModal> {
	public constructor(page: TipRainModal) {
		super(page);
	}

	@step("Tip rain successfully")
	public async tipRainSuccessfully(
		gamdomApi: GamdomApi,
		cookie: string,
		value: number,
	): Promise<void> {
		await this.gamdomPage.tipRainValuePolled(gamdomApi, cookie, value);
		await this.gamdomPage.assertThat().tipRainModalIsNotDisplayed();
	}

	@step("Verify modal and tip rain successfully")
	public async verifyModalAndTipRainSuccessfully(
		gamdomApi: GamdomApi,
		cookie: string,
		value: number,
	): Promise<void> {
		await this.gamdomPage.assertThat().tipRainModalIsDisplayed();
		await this.tipRainSuccessfully(gamdomApi, cookie, value);
	}
}
