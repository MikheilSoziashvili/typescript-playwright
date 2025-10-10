import * as Configuration from "../configuration";
import { PayloadType } from "@core/types/types";
import { JiraEnvironment } from "@enums/jira-environment";
import { JiraSanitizer } from "@core/reporters/jira-failed-tests-reporter/sanitizer/jira-failed-report-sanitizer";
import { trailingHashPattern } from "@support/regex-patterns";
import {
	JIRA_AUTOMATION_LABELS,
	JIRA_ENVIRONMENT_FIELD_VALUE,
	JIRA_PARENT_EPIC_KEY,
	JIRA_PROJECT_KEY,
	JIRA_STORY_POINTS,
} from "@core/reporters/jira-failed-tests-reporter/config/jira-failed-report-config";

const timestamp = new Date().toISOString();
const buildNumber = process.env.BUILD_NUMBER;
const buildUrl = process.env.BUILD_URL;

const summary =
	`Test Execution [Automation] - ${timestamp} ` +
	(buildNumber ? `- Build #${buildNumber}` : "- Local");
const execution = buildUrl ? `Build URL - ${buildUrl}` : "Local test execution";

export const createExecutionBody = {
	fields: {
		project: {
			key: Configuration.jira.projectKey,
		},
		summary: summary,
		description: execution,
		customfield_10001: "fc17a3f8-a02f-4ff7-a778-04d544af0828",
		assignee: {
			id: "712020:654320ee-3225-462d-b066-57da9c3b7fd5",
		},
		labels: ["qa-automation"],
		issuetype: {
			name: "Test Execution",
		},
	},
};

/**
 * Builds a JQL search payload for querying JIRA issues.
 * @param jql - JQL query string
 * @param fields - Array of field names to return in the results (default: ["key", "summary"])
 * @param maxResults - Maximum number of results to return (default: 1)
 * @returns JQL search payload ready for API submission
 */
export function buildJqlSearchPayload(
	jql: string,
	fields: string[] = ["key", "summary"],
	maxResults = 1,
): PayloadType {
	return {
		jql: jql,
		fields: fields,
		maxResults: maxResults,
	};
}

/**
 * Builds the issue description for a failed test JIRA bug.
 * Includes links to the report and specific test, along with stack trace.
 * @param testName - Sanitized test name
 * @param reportUrl - Base URL of the test report
 * @param specId - Unique identifier for the test spec
 * @param stackTrace - Stack trace from the test failure
 * @returns Formatted JIRA description with links and stack trace
 */
export function buildIssueDescription(
	testName: string,
	reportUrl: string,
	specId: string,
	stackTrace: string,
): string {
	const normalizedUrl = reportUrl.replace(trailingHashPattern, "");
	const encodedTestId = encodeURIComponent(specId);
	const testLink = `${normalizedUrl}#?testId=${encodedTestId}`;

	return [
		`[View Report|${reportUrl}]`,
		`[View Test|${testLink}]`,
		"",
		"*Stack Trace:*",
		"{code}",
		stackTrace.trim(),
		"{code}",
		"",
		"*Additional Info:*",
		"Auto-generated issue from automation reporter. View the linked report above for video, trace, screenshots, and detailed investigation - the steps/results below may be incomplete or absent.",
		"",
		`*Test Case:* ${testName}`,
	].join("\n");
}

/**
 * Builds the complete JIRA payload for creating a failed test bug.
 * Includes all required fields, custom fields, and test failure details.
 * @param summary - JIRA issue summary (test name with prefix)
 * @param description - Formatted description with links and stack trace
 * @param accountId - JIRA account ID to assign the issue to
 * @param stepsToReproduce - Steps taken during test execution
 * @param expectedResult - Expected test behavior
 * @param actualResult - Actual test behavior (failure)
 * @returns Complete JIRA payload ready for API submission
 */
export function buildJiraPayload(
	summary: string,
	description: string,
	accountId: string,
	stepsToReproduce: string,
	expectedResult: string,
	actualResult: string,
): PayloadType {
	return {
		fields: {
			project: { key: JIRA_PROJECT_KEY },
			summary: summary,
			description: description,
			issuetype: { name: "Bug" },
			assignee: { id: accountId },
			parent: { key: JIRA_PARENT_EPIC_KEY },
			customfield_10026: JIRA_STORY_POINTS,
			customfield_10080: JiraSanitizer.truncateSteps(stepsToReproduce),
			customfield_10081: expectedResult,
			customfield_10082: actualResult,
			customfield_10083: [{ value: JiraEnvironment.STAGING }],
			customfield_10001: JIRA_ENVIRONMENT_FIELD_VALUE,
			labels: [...JIRA_AUTOMATION_LABELS],
		},
	};
}
