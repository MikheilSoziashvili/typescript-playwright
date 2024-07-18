import { test as base } from "@playwright/test";

import { MailinatorApi } from "@api/mailinator-api";
import { GamdomApi } from "@api/gamdom-api";

export type Apis = {
	mailinatorApi: MailinatorApi;
	gamdomApi: GamdomApi;
};

export const apisFixtures = base.extend<Apis>({
	mailinatorApi: async ({}, use) => {
		await use(new MailinatorApi());
	},
	gamdomApi: async ({}, use) => {
		await use(new GamdomApi());
	},
});
