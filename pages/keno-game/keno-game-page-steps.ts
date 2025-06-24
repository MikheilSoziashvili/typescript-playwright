import { BasePageStep } from "@pages/base/base-page-step";
import { KenoGamePage } from "./keno-game-page";

export class KenoGamePageSteps extends BasePageStep<KenoGamePage> {
	public constructor(gamdomPage: KenoGamePage) {
		super(gamdomPage);
	}
}
