import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { XpChallengeAdminSetupFlow } from "./xp-challenge-admin-setup-test-flow";
import { XpChallengeActivationFlow } from "./xp-challenge-activation-test-flow";
import { XpChallengeCompletionFlow } from "./xp-challenge-completion-test-flow";

export class XpChallengeTestFlow extends BaseTestFlow {
	constructor(
		private readonly adminSetupFlow: XpChallengeAdminSetupFlow,
		private readonly activationFlow: XpChallengeActivationFlow,
		private readonly completionFlow: XpChallengeCompletionFlow,
	) {
		super();
	}

	@testFlow("Admin: Create XP Challenge reward")
	public async adminCreateXpChallenge(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		evRequired: number;
		challengeDuration: number;
		rewardAmount: number;
	}): Promise<void> {
		await this.adminSetupFlow.setupXpChallengeReward(params);
	}

	@testFlow("User: Activate and claim XP Challenge reward")
	public async userActivateAndClaimXpChallenge(params: {
		user: BrowserUserSession;
		betAmount: number;
		rewardAmount: number;
	}): Promise<void> {
		const { user, betAmount, rewardAmount } = params;

		await this.activationFlow.activateXpChallenge({ user });

		await this.completionFlow.completeAndClaimReward({
			user,
			betAmount,
			rewardAmount,
		});
	}
}
