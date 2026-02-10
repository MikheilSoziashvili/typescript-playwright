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
				throw new Error(
					"Test has known bug ticket(s) - retry disabled",
				);
			}

			await use();
		},
		{ auto: true },
	],
});
