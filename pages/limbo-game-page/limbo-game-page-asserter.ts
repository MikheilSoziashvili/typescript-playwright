import { BaseAsserter } from "@base/base-asserter";
import { LimboGamePage } from "./limbo-game-page";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";

export class LimboGamePageAsserter extends BaseAsserter<LimboGamePage> {
	public constructor(page: LimboGamePage) {
		super(page);
	}

	@step("Roll button is visible")
	public async rollButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.rollButton],
			Timeout.LONG,
		);
	}
}
