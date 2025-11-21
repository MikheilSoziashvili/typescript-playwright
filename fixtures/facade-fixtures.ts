import { GamdomApiDbFacade } from "@core/facades/gamdom-api-db/gamdom-api-db-facade";
import { GamdomApiFacade } from "@core/facades/gamdom-api/gamdom-api-facade";
import { test as base } from "@playwright/test";

export type Facades = {
	gamdomApiDbFacade: GamdomApiDbFacade;
	gamdomApiFacade: GamdomApiFacade;
};

export const facadesFixtures = base.extend<Facades>({
	gamdomApiDbFacade: async ({}, use) => {
		await use(new GamdomApiDbFacade());
	},

	gamdomApiFacade: async ({}, use) => {
		await use(new GamdomApiFacade());
	},
});
