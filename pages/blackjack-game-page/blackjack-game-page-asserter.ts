import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { BlackjackGamePage } from "./blackjack-game-page";

export class BlackjackGamePageAsserter extends BaseAsserter<BlackjackGamePage> {
	public constructor(page: BlackjackGamePage) {
		super(page);
	}

	@step("Verify play button is visible")
	public async playButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.playButton]);
	}
}
