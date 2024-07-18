import { test as base } from "@playwright/test";
import { MailinatorApi } from "@api/mailinator-api";
import * as Configuration from "../configuration";

export type Apis = {
	mailinatorApi: MailinatorApi;
};

export const apisFixtures = base.extend<Apis>({
	mailinatorApi: async ({}, use) => {
		await use(new MailinatorApi(Configuration.mailinator));
	},
});
