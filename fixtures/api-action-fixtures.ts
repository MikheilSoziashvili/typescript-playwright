import { test as base } from "@playwright/test";

import { GamdomApiActions } from "@api/gamdom-api-actions";

export type ApiActions = {
	gamdomApiActions: GamdomApiActions;
};

export const apiActionsFixtures = base.extend<ApiActions>({
	gamdomApiActions: async ({ page }, use) => {
		await use(new GamdomApiActions(page));
	},
});
