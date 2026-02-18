import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { ReloadRewardAdminSetupFlow } from "./reload-reward-admin-setup-test-flow";
import { ReloadRewardActivationFlow } from "./reload-reward-activation-test-flow";

export class ReloadRewardTestFlow extends BaseTestFlow {
	constructor(
		private readonly adminSetupFlow: ReloadRewardAdminSetupFlow,
		private readonly activationFlow: ReloadRewardActivationFlow,
	) {
		super();
	}

	@testFlow("Admin: Create Reload reward")
	public async adminCreateReloadReward(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		amount: string;
	}): Promise<void> {
		await this.adminSetupFlow.setupReloadReward(params);
	}

	@testFlow("User: Activate Reload reward")
	public async userActivateReloadReward(params: {
		user: BrowserUserSession;
		amount: string;
	}): Promise<void> {
		await this.activationFlow.activateReloadReward(params);
	}

	@testFlow("Admin: Verify Reload reward is active")
	public async adminVerifyReloadRewardIsActive(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		totalAmount: string;
	}): Promise<void> {
		await this.activationFlow.verifyReloadRewardIsActive(params);
	}
}
