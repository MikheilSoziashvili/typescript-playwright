import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { Unit } from "@enums/units";

export class PlinkoUserSetupFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Prepare regular user for Plinko betting")
	public async prepareRegularUser(params: {
		walletUnits: Unit[];
		initialAmount: number;
	}): Promise<BrowserUserSession> {
		const user = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				reuseContext: true,
				regularUserWalletOptions: {
					walletUnits: params.walletUnits,
					amount: params.initialAmount,
				},
			},
		);

		await user.pages.plinkoGamePage.navigate();

		return user;
	}
}
