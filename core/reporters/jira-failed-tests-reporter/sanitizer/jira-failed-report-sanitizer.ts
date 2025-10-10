import {
	newlinePattern,
	carriageReturnPattern,
	multipleSpacesPattern,
	nonPrintableCharsPattern,
	backslashPattern,
	doubleQuotePattern,
	windowsLineEndingPattern,
} from "@support/regex-patterns";
import {
	JIRA_PROJECT_KEY,
	JIRA_STEPS_MAX_LENGTH,
} from "../config/jira-failed-report-config";

export class JiraSanitizer {
	/**
	 * Sanitizes test names to meet JIRA's summary field requirements.
	 * Removes newlines, carriage returns, non-printable characters, and collapses multiple spaces.
	 * @param testName - The original test name
	 * @returns Sanitized test name safe for JIRA summary field
	 */
	static sanitizeTestName(testName: string): string {
		return testName
			.replace(newlinePattern, " ")
			.replace(carriageReturnPattern, " ")
			.replace(multipleSpacesPattern, " ")
			.replace(nonPrintableCharsPattern, "")
			.trim();
	}

	/**
	 * Escapes special characters in strings for safe use in JQL queries.
	 * Prevents JQL syntax errors when searching for issues.
	 * @param text - The text to escape
	 * @returns JQL-safe escaped string
	 */
	static escapeJqlString(text: string): string {
		return text
			.replace(backslashPattern, "\\\\")
			.replace(doubleQuotePattern, '\\"');
	}

	/**
	 * Escapes special characters for safe use in JQL text search queries.
	 * Note: JQL text search (~) has different escaping rules than exact match (=).
	 * Only backslashes and quotes need escaping for the ~ operator.
	 * @param testName - Test name to escape
	 * @returns JQL-safe escaped test name for use with ~ operator
	 */
	static escapeForJqlTextSearch(testName: string): string {
		// Order matters: backslashes must be escaped first to prevent double-escaping.
		// Note: Parentheses DO NOT need escaping in JQL text search.
		const escapeRules: [RegExp, string][] = [
			[backslashPattern, "\\\\"],
			[doubleQuotePattern, '\\"'],
		];

		return escapeRules.reduce(
			(escaped, [pattern, replacement]) =>
				escaped.replace(pattern, replacement),
			testName,
		);
	}

	/**
	 * Builds a JQL query to search for duplicate automation-created issues.
	 * Searches for bugs in the ENG project with matching test name that are not done.
	 * @param escapedTestName - Escaped test name for JQL (use escapeForJqlTextSearch first)
	 * @returns JQL query string ready for execution
	 */
	static buildDuplicateSearchJql(escapedTestName: string): string {
		return `project = ${JIRA_PROJECT_KEY} AND issuetype = Bug AND summary ~ "${escapedTestName}" AND labels = "automation-detected" AND statusCategory != Done ORDER BY created DESC`;
	}

	/**
	 * Normalizes line endings in description fields.
	 * Converts Windows-style CRLF to Unix-style LF.
	 * @param description - The description text
	 * @returns Sanitized description with normalized line endings
	 */
	static sanitizeDescription(description: string): string {
		return description.replace(windowsLineEndingPattern, "\n").trim();
	}

	/**
	 * Truncates steps text if it exceeds JIRA's field character limit.
	 * Cuts at the last complete line to avoid mid-sentence truncation.
	 * @param steps - The steps to reproduce text
	 * @param maxLength - Maximum allowed length (default from config: 32000, JIRA limit: 32767)
	 * @returns Truncated steps with indication note if truncation occurred
	 */
	static truncateSteps(
		steps: string,
		maxLength: number = JIRA_STEPS_MAX_LENGTH,
	): string {
		if (steps.length <= maxLength) {
			return steps;
		}

		const truncated = steps.substring(0, maxLength);
		const lastNewline = truncated.lastIndexOf("\n");

		const result =
			lastNewline > 0 ? truncated.substring(0, lastNewline) : truncated;

		return `${result}\n\n... (truncated - steps exceeded ${maxLength} characters)`;
	}
}
