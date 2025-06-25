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
}
