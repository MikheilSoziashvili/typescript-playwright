import { test as base } from "@playwright/test";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { PlinkoBetTestFlow } from "@test-flows/originals/plinko/plinko-bet-test-flow";
import { PlinkoBalanceVerificationFlow } from "@test-flows/originals/plinko/plinko-balance-verification-test-flow";
import { PlinkoBetExecutionFlow } from "@test-flows/originals/plinko/plinko-bet-execution-test-flow";
import { PlinkoUserSetupFlow } from "@test-flows/originals/plinko/plinko-user-setup-test-flow";
import { XpChallengeTestFlow } from "@test-flows/rewards/xp-challenge-test-flow";
import { XpChallengeAdminSetupFlow } from "@test-flows/rewards/xp-challenge-admin-setup-test-flow";
import { XpChallengeActivationFlow } from "@test-flows/rewards/xp-challenge-activation-test-flow";
import { XpChallengeCompletionFlow } from "@test-flows/rewards/xp-challenge-completion-test-flow";

export type TestFlowsFixtures = {
	plinkoBetTestFlow: PlinkoBetTestFlow;
	xpChallengeTestFlow: XpChallengeTestFlow;
};

type RequiredTestFlowsFixtures = {
	browserSessionManager: BrowserSessionManager;
};

export const testFlowsFixtures = base.extend<
	TestFlowsFixtures & RequiredTestFlowsFixtures
>({
	plinkoBetTestFlow: async ({ browserSessionManager }, use) => {
		await use(
			new PlinkoBetTestFlow(
				new PlinkoUserSetupFlow(browserSessionManager),
				new PlinkoBetExecutionFlow(),
				new PlinkoBalanceVerificationFlow(),
			),
		);
	},
	xpChallengeTestFlow: async ({}, use) => {
		await use(
			new XpChallengeTestFlow(
				new XpChallengeAdminSetupFlow(),
				new XpChallengeActivationFlow(),
				new XpChallengeCompletionFlow(),
			),
		);
	},
});
