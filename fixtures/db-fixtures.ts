import { test as base } from "@playwright/test";
import { GamdomDb } from "database/gamdom-db";

export type DataBases = {
	gamdomDb: GamdomDb;
};

export const dbsFixtures = base.extend<DataBases>({
	gamdomDb: async ({}, use) => {
		await use(new GamdomDb());
	},
});
