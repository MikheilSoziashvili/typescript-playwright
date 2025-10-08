/**
 *
 * - Used for processing bulk tip CSV data
 * and computing test expectations for valid and invalid user tips.
 * - Used in bulk tip tests to parse CSV rows and determine which tips should succeed or fail.
 * - Helps build assertions for test results based on user IDs and tip values.
 *
 * Example:
 *   const expectations = computeBulkTipExpectations(rows, createdIds);
 *   // Use expectations.successUserIds and expectations.errorUserIds in assertions
 */

export function computeBulkTipExpectations(
	rows: string[][],
	createdIds: Set<string>,
): {
	expectedValid: { userId: string; tip: number }[];
	expectedInvalid: { userId: string; tip: number }[];
	successUserIds: string[];
	errorUserIds: string[];
	totalUsd: number;
	totalUsersAll: number;
} {
	const data = rows.slice(1); // skip header
	const parsed = data
		.filter((r) => r.length >= 2)
		.map((r) => ({ userId: r[0], tip: Number(r[1]) }));

	const expectedValid = parsed.filter(
		(r) => createdIds.has(r.userId) && r.tip >= 0,
	);
	const expectedInvalid = parsed.filter(
		(r) => !createdIds.has(r.userId) || r.tip < 0,
	);

	return {
		expectedValid: expectedValid,
		expectedInvalid: expectedInvalid,
		successUserIds: expectedValid.map((r) => r.userId),
		errorUserIds: expectedInvalid.map((r) => r.userId),
		totalUsd: expectedValid.reduce((sum, r) => sum + r.tip, 0),
		totalUsersAll: parsed.length,
	} as const;
}
