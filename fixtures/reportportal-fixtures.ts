import { test as base, TestInfo } from "@playwright/test";
import { ReportPortalSetupHandler } from "@core/reporters/reportportal/handlers/reportportal-setup-handler";

/**
 * Auto-use fixture that handles ReportPortal setup
 * Runs automatically for every test without explicit destructuring
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const reporterFixtures = base.extend<{ _reportPortalTest: void }>({
	_reportPortalTest: [
		async ({}, use, testInfo: TestInfo) => {
			const setupHandler = new ReportPortalSetupHandler();
			setupHandler.setup(testInfo);

			await use();
		},
		{ auto: true },
	],
});
