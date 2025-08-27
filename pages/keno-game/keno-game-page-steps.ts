import { BasePageStep } from "@pages/base/base-page-step";
import { KenoGamePage } from "./keno-game-page";
import { step } from "decorators/step";

export class KenoGamePageSteps extends BasePageStep<KenoGamePage> {
	public constructor(gamdomPage: KenoGamePage) {
		super(gamdomPage);
	}

	@step("Start autobet")
	public async startAutobet(): Promise<void> {
		await this.gamdomPage.map.autobetSection.click();
		await this.gamdomPage.map.pickRandomTilesButton.click();
		await this.gamdomPage.map.startPlayingButton.click();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.stopPlayingButton]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([this.gamdomPage.map.betAmountInput]);
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.gamdomPage.map.stopPlayingButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.startPlayingButton]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([this.gamdomPage.map.betAmountInput]);
	}
}
