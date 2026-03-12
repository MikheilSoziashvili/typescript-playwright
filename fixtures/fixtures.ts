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
import { listenersFixtures } from "./listeners-fixtures";
import { cryptoFixtures } from "./crypto-fixtures";
import { visualAutomationFixtures } from "./visual-automation-fixtures";
import { slackWebApisFixtures } from "./slack-web-api-fixtures";
import { reporterFixtures } from "./reportportal-fixtures";
import { testFlowsFixtures } from "./test-flows-fixtures";
import { retryFixtures } from "./retry-fixtures";
import { apiErrorLogFixtures } from "./api-error-log-fixtures";

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
	listenersFixtures,
	cryptoFixtures,
	visualAutomationFixtures,
	slackWebApisFixtures,
	reporterFixtures,
	testFlowsFixtures,
	retryFixtures,
	apiErrorLogFixtures,
);
