import { mergeTests } from "@playwright/test";

import { externalPagesFixtures } from "./external-pages-fixtures";
import { componentsFixtures } from "./components-fixtures";
import { modalsFixtures } from "./modal-fixtures";
import { apisFixtures } from "./api-fixtures";
import { adminPagesFixtures } from "./admin-pages-fixtures";
import { gamePagesFixtures } from "./game-pages-fixtures";
import { gamdomPagesFixtures } from "./gamdom-pages";
import { apiActionsFixtures } from "./api-action-fixtures";

export const test = mergeTests(
	gamdomPagesFixtures,
	adminPagesFixtures,
	gamePagesFixtures,
	externalPagesFixtures,
	componentsFixtures,
	modalsFixtures,
	apisFixtures,
	apiActionsFixtures,
);
