import { APIResponse } from "@playwright/test";
import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { encodeCredentials } from "@core/utils/utils";
import { PayloadType } from "@core/types/types";
import { logger } from "@logger/logger";
import { HttpStatus } from "@enums/http-status";
import { JiraSanitizer } from "@core/reporters/jira-failed-tests-reporter/sanitizer/jira-failed-report-sanitizer";
import {
	buildIssueDescription,
	buildJiraPayload,
	buildJqlSearchPayload,
} from "@api/jira-api-payloads";
import {
	JiraCreateIssueResponse,
	JiraSearchResponse,
} from "@core/types/jira-types";
import { JIRA_AUTOMATION_SUMMARY_PREFIX } from "@core/reporters/jira-failed-tests-reporter/config/jira-failed-report-config";
import { JIRA_CREATE_ISSUE_ENDPOINT, JIRA_SEARCH_JQL_ENDPOINT } from "@enums/jira/jira-api-endpoints";

export class JiraApi extends BaseApi {
	private jiraConfig: Record<string, string>;

	constructor(jiraConfig: Record<string, string> = Configuration.jira) {
		super(jiraConfig.baseUrl);
		this.jiraConfig = jiraConfig;

		this.setHeaders({
			"Content-Type": "application/json",
			Authorization: `Basic ${encodeCredentials(
				this.jiraConfig.username,
				this.jiraConfig.token,
			)}`,
			Origin: this.jiraConfig.baseUrl,
		});
	}

	/**
	 * Checks if a duplicate issue already exists in JIRA with the same summary.
	 * Logs a warning if a duplicate is found.
	 * @param summary - The JIRA issue summary to search for
	 * @returns The existing issue key if a duplicate is found, undefined otherwise
	 */
	private async checkForDuplicateIssue(
		summary: string,
	): Promise<string | undefined> {
		const existingIssueKey = await this.searchIssueBySummary(summary);

		if (existingIssueKey) {
			logger.warn(`Skipped – issue already exists: ${existingIssueKey}`);
		}

		return existingIssueKey;
	}

	private async processJiraResponse(
		response: APIResponse,
		testName: string,
	): Promise<string | undefined> {
		const statusCode = response.status();

		if (
			statusCode < HttpStatus.OK ||
			statusCode >= HttpStatus.MOVED_PERMANENTLY
		) {
			const responseBody = await response.text();
			logger.error(
				`Creation of bug returned status code ${statusCode} for test [${testName}]. Response: ${responseBody}`,
			);
			return;
		}

		const json = (await response.json()) as JiraCreateIssueResponse;

		if (!json.key) {
			logger.error(
				`Failed to extract issue key from JIRA response: ${JSON.stringify(
					json,
					null,
					2,
				)}`,
			);
			return;
		}

		return json.key;
	}

	public async createExecution(
		data: PayloadType,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const parameters = this.buildParameters(
			JIRA_CREATE_ISSUE_ENDPOINT,
			data,
			_headers,
		);
		return this.post(parameters);
	}

	public async createJiraBugForFailedTests(
		testName: string,
		accountId: string,
		reportUrl: string,
		stackTrace: string,
		stepsToReproduce: string,
		expectedResult: string,
		actualResult: string,
		specId: string,
	): Promise<string | undefined> {
		const sanitizedTestName = JiraSanitizer.sanitizeTestName(testName);
		const summary = `${JIRA_AUTOMATION_SUMMARY_PREFIX} ${sanitizedTestName}`;

		const existingIssueKey = await this.checkForDuplicateIssue(summary);
		if (existingIssueKey) {
			return;
		}

		const description = buildIssueDescription(
			sanitizedTestName,
			reportUrl,
			specId,
			stackTrace,
		);

		const payload = buildJiraPayload(
			summary,
			description,
			accountId,
			stepsToReproduce,
			expectedResult,
			actualResult,
		);

		const response = await this.createExecution(payload);

		return this.processJiraResponse(response, testName);
	}

	public async searchIssueBySummary(
		summary: string,
	): Promise<string | undefined> {
		try {
			const testName = this.extractTestName(summary);
			const escapedTestName =
				JiraSanitizer.escapeForJqlTextSearch(testName);
			const jql = JiraSanitizer.buildDuplicateSearchJql(escapedTestName);

			const response = await this.executeJqlSearch(jql);
			return await this.extractIssueKeyFromResponse(response);
		} catch (error) {
			logger.error("Failed to search JIRA for duplicates:", error);
			return undefined; // Don't block issue creation on search failure
		}
	}

	/**
	 * Extracts the test name by removing the [Automation Reporter] prefix.
	 * @param summary - Full JIRA issue summary
	 * @returns Test name without the automation prefix
	 */
	private extractTestName(summary: string): string {
		return summary.replace(`${JIRA_AUTOMATION_SUMMARY_PREFIX} `, "").trim();
	}

	/**
	 * Executes a JQL search query against JIRA API.
	 * @param jql - JQL query string
	 * @returns API response
	 * @throws Error if response status is not 200
	 */
	private async executeJqlSearch(jql: string): Promise<APIResponse> {
		const payload = buildJqlSearchPayload(jql);

		const response = await this.post({
			endpoint: JIRA_SEARCH_JQL_ENDPOINT,
			data: payload,
		});

		if (response.status() !== HttpStatus.OK) {
			throw new Error(
				`JIRA search failed with status ${response.status()}`,
			);
		}

		return response;
	}

	/**
	 * Extracts the issue key from a JIRA search response.
	 * @param response - JIRA API response
	 * @returns Issue key if found, undefined otherwise
	 */
	private async extractIssueKeyFromResponse(
		response: APIResponse,
	): Promise<string | undefined> {
		const json = (await response.json()) as JiraSearchResponse;

		if (json.issues.length > 0) {
			return json.issues[0].key;
		}

		return undefined;
	}
}
