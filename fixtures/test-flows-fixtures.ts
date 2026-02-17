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
import { PromotionTestFlow } from "@test-flows/promotions/promotion-test-flow";
import { PromotionSetupFlow } from "@test-flows/promotions/promotion-setup-test-flow";
import { PromotionCreationFlow } from "@test-flows/promotions/promotion-creation-test-flow";
import { PromotionVisibilityVerificationFlow } from "@test-flows/promotions/promotion-visibility-verification-test-flow";
import { GamdomDb } from "database/gamdom-db";
import { RandomDataSource } from "test-data/core/random-data-source";
import { ObjectDataSource } from "test-data/core/object-data-source";

export type TestFlowsFixtures = {
	plinkoBetTestFlow: PlinkoBetTestFlow;
	xpChallengeTestFlow: XpChallengeTestFlow;
	promotionTestFlow: PromotionTestFlow;
	promotionVisibilityVerificationFlow: PromotionVisibilityVerificationFlow;
};

type RequiredTestFlowsFixtures = {
	browserSessionManager: BrowserSessionManager;
	gamdomDb: GamdomDb;
	testDataRandom: RandomDataSource;
	testDataObject: ObjectDataSource;
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
	promotionTestFlow: async (
		{ gamdomDb, testDataRandom, testDataObject },
		use,
	) => {
		await use(
			new PromotionTestFlow(
				new PromotionSetupFlow(
					gamdomDb,
					testDataRandom,
					testDataObject,
				),
				new PromotionCreationFlow(),
			),
		);
	},
	promotionVisibilityVerificationFlow: async ({}, use) => {
		await use(new PromotionVisibilityVerificationFlow());
	},
});
