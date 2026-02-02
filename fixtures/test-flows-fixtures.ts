import { test as base } from "@playwright/test";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { PlinkoBetTestFlow } from "@test-flows/originals/plinko/plinko-bet-test-flow";
import { PlinkoBalanceVerificationFlow } from "@test-flows/originals/plinko/plinko-balance-verification-test-flow";
import { PlinkoBetExecutionFlow } from "@test-flows/originals/plinko/plinko-bet-execution-test-flow";
import { PlinkoUserSetupFlow } from "@test-flows/originals/plinko/plinko-user-setup-test-flow";

export type TestFlowsFixtures = {
	plinkoBetTestFlow: PlinkoBetTestFlow;
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
});
