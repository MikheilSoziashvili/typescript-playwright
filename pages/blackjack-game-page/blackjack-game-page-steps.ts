import { BasePageStep } from "@pages/base/base-page-step";
import { BlackjackGamePage } from "./blackjack-game-page";

export class BlackjackGamePageSteps extends BasePageStep<BlackjackGamePage> {
	public constructor(gamdomPage: BlackjackGamePage) {
		super(gamdomPage);
	}
}
