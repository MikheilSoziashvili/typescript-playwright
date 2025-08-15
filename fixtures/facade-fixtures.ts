import { GamdomApiDbFacade } from "@core/facades/gamdom-api-db/gamdom-api-db-facade";
import { test as base } from "@playwright/test";

export type Facades = {
	gamdomApiDbFacade: GamdomApiDbFacade;
};

export const facadesFixtures = base.extend<Facades>({
	gamdomApiDbFacade: async ({}, use) => {
		await use(new GamdomApiDbFacade());
	},
});
