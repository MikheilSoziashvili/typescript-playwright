import { getISODate } from "./utils";

/**
 * Calculates the target date relative to today's date.
 *
 * @param offset - Number of days to offset from today (e.g., -7 for a week ago, +3 for three days ahead).
 * @returns The resulting Date object.
 */
export function getTargetDate(offset: number): Date {
	const iso = getISODate({ daysOffset: offset, hours: 0, minutes: 0 });
	return new Date(iso);
}

/**
 * Extracts individual date components from a Date object.
 *
 * @param date - The date to extract parts from.
 * @returns An object containing `day`, `month`, and `year`.
 */
export function extractDateParts(date: Date): {
	day: number;
	month: number;
	year: number;
} {
	return {
		day: date.getDate(),
		month: date.getMonth(),
		year: date.getFullYear(),
	};
}
