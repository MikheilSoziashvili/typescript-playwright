import { DISABLE_RETRIES_ANNOTATION_TYPE } from "@core/types/types";
import { test as base } from "@playwright/test";

/**
 * Auto-use fixture that disables retries for tests with known bug tickets
 * Runs automatically for every test without explicit destructuring
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const retryFixtures = base.extend<{
	_disableRetriesForBugTickets: void;
}>({
	_disableRetriesForBugTickets: [
		async ({}, use, testInfo) => {
			const hasBugTickets = testInfo.annotations.some(
				(annotation) =>
					annotation.type === DISABLE_RETRIES_ANNOTATION_TYPE,
			);

			if (hasBugTickets && testInfo.retry > 0) {
				testInfo.skip(
					true,
					"Test has known bug tickets - skipping retry",
				);
			}

			await use();
		},
		{ auto: true },
	],
});
