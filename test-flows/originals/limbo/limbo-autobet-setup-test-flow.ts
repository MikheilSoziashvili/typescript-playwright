import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";
import { TestUserRole } from "@enums/test-user-roles";
import { Unit } from "@enums/units";
import { LimboBetTestData } from "@dtos/test-data";
import { predefined } from "test-data/sources/predefined";

export type LimboAutobetSetupResult = {
	user: BrowserUserSession;
	initialCoins: number;
};

export class LimboAutobetSetupFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Navigate to Limbo, switch to auto mode and start auto play")
	public async setupAndStartAutoPlay(params: {
		limboBetData: LimboBetTestData;
	}): Promise<LimboAutobetSetupResult> {
		const user = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				reuseContext: true,
				regularUserWalletOptions: {
					walletUnits: [Unit.COINS],
					amount: predefined.limboAutobet.amount,
				},
			},
		);

		await user.pages.limboGamePage.steps().navigateAndAssertRollButton();

		await user.pages.limboGamePage
			.steps()
			.switchToAutoModeAndAssertStartPlaying(params.limboBetData);

		const balanceHandler = new UserBalanceHandler(
			user.pages.limboGamePage.page,
		);
		const initialCoins = await balanceHandler.walletBalanceInCoins();

		await user.pages.limboGamePage
			.steps()
			.startAutoPlayAndAssertStopPlaying();

		return { user, initialCoins };
	}
}
