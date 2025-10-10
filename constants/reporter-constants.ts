/**
 * Constants for Playwright reporters
 * Centralized configuration for all reporter paths and formats
 */

/**
 * Built-in Playwright report formats
 */
export const REPORT_FORMATS = {
	LIST: "list",
	HTML: "html",
	BLOB: "blob",
	JUNIT: "junit",
	JSON: "json",
} as const;

/**
 * Custom reporter paths
 */
export const REPORTERS = {
	/** JIRA/XRay test execution reporter */
	JIRA: "./core/reporters/jira-reporter/jira-reporter.ts",
	/** Local JIRA failed tests reporter (for debugging) */
	LOCAL_JIRA_FAILED:
		"./core/reporters/jira-failed-tests-reporter/jira-failed-tests-local-report.ts",
} as const;

/**
 * HTML reporter configuration options
 */
export const HTML_REPORTER_OPTIONS = {
	open: "never",
} as const;
