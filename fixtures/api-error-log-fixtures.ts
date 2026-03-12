import { clearApiErrorLog, getApiErrorLogContent } from "@logger/logger";
import { test as base } from "@playwright/test";

/**
 * Auto-use fixture that attaches the API error log to the HTML report on test failure.
 * Clears the log before each test so only errors from the current test are captured.
 */
export const apiErrorLogFixtures = base.extend<{
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	_attachApiErrorLog: void;
}>({
	_attachApiErrorLog: [
		async ({}, use, testInfo) => {
			clearApiErrorLog();

			await use();

			if (testInfo.status !== testInfo.expectedStatus) {
				const content = getApiErrorLogContent();
				if (content) {
					await testInfo.attach("api-errors.log", {
						body: content,
						contentType: "text/plain",
					});
				}
			}
		},
		{ auto: true },
	],
});
