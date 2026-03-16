import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { LimboBetTestData } from "@dtos/test-data";

export class LimboAutobetExecutionFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Play Limbo auto rounds, verify balance and stop auto play")
	public async playRoundsAndStop(params: {
		user: BrowserUserSession;
		limboBetData: LimboBetTestData;
		numberOfRounds: number;
		initialCoins: number;
	}): Promise<void> {
		await params.user.pages.limboGamePage
			.steps()
			.playAutoRoundsAndVerifyBalance(
				params.limboBetData,
				params.numberOfRounds,
				params.initialCoins,
			);

		await params.user.pages.limboGamePage
			.assertThat()
			.startPlayingButtonIsVisible();
	}
}
