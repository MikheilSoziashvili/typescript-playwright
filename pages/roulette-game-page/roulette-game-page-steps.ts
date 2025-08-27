import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { RouletteGamePage } from "./roulette-game-page";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";

export class RouletteGamePageSteps extends BasePageStep<RouletteGamePage> {
	public constructor(gamdomPage: RouletteGamePage) {
		super(gamdomPage);
	}

	@step("Start green hunt")
	public async startGreenHunt(
		bet: number,
		type: GreenHuntTypeOption,
	): Promise<void> {
		await this.gamdomPage.expandAutobetSection();
		await this.gamdomPage.map
			.greenHuntAutomaticallyBetTextInput()
			.fill(bet.toString());
		await this.gamdomPage.selectGreenHuntType(type);
		await this.gamdomPage.map.startGreenHuntButton().click();

		await this.gamdomPage.assertThat().greenHuntIsActive();
	}

	@step("Start autobet")
	public async startAutobet(stopAutobetValue: number): Promise<void> {
		await this.gamdomPage.expandAutobetSection();
		await this.gamdomPage.map.stopIfBalanceIsOver.fill(
			stopAutobetValue.toString(),
		);
		await this.gamdomPage.map.startAutobetButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.stopAutobetButton]);
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.gamdomPage.map.stopAutobetButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.startAutobetButton]);
	}
}
