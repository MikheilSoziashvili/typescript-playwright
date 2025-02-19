import { BasePageStep } from "@pages/base/base-page-step";
import { PlinkoGamePage } from "./plinko-game-page";

export class PlinkoGamePageSteps extends BasePageStep<PlinkoGamePage> {
	public constructor(gamdomPage: PlinkoGamePage) {
		super(gamdomPage);
	}
}
