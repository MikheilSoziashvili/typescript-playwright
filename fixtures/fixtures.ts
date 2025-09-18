import { mergeTests } from "@playwright/test";

import { externalPagesFixtures } from "./external-pages-fixtures";
import { componentsFixtures } from "./components-fixtures";
import { modalsFixtures } from "./modal-fixtures";
import { apisFixtures } from "./api-fixtures";
import { adminPagesFixtures } from "./admin-pages-fixtures";
import { gamePagesFixtures } from "./game-pages-fixtures";
import { gamdomPagesFixtures } from "./gamdom-pages";
import { dbsFixtures } from "./db-fixtures";
import { gamdomHandlersFixtures } from "./handlers-fixtures";
import { facadesFixtures } from "./facade-fixtures";
import { testDataFixtures } from "./test-data-fixtures";

export const test = mergeTests(
	gamdomPagesFixtures,
	gamdomHandlersFixtures,
	adminPagesFixtures,
	gamePagesFixtures,
	externalPagesFixtures,
	componentsFixtures,
	modalsFixtures,
	apisFixtures,
	dbsFixtures,
	facadesFixtures,
	testDataFixtures,
);
