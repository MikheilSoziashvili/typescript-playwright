import { test as base } from "@playwright/test";

import { MailinatorApi } from "@api/mailinator-api";
import { GamdomApiActions } from "@api/gamdom-api-actions";

export type Apis = {
	mailinatorApi: MailinatorApi;
	gamdomApiActions: GamdomApiActions;
};

export const apisFixtures = base.extend<Apis>({
	mailinatorApi: async ({}, use) => {
		await use(new MailinatorApi());
	},
	gamdomApiActions: async ({ page }, use) => {
		await use(new GamdomApiActions(page));
	},
});
