import { test as base } from "@playwright/test";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";

export type GamdomHandlers = {
	userBalanceHandler: UserBalanceHandler;
};

export const gamdomHandlersFixtures = base.extend<GamdomHandlers>({
	userBalanceHandler: async ({ page }, use) => {
		const handler = new UserBalanceHandler(page);
		await use(handler);
	},
});
