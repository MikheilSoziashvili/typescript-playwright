import { JiraApi } from "@api/jira-api";
import { IReportParser } from "../interfaces/report-parser";
import { IUserResolver } from "../interfaces/user-resolver";
import { ParsedTest } from "../models/parsed-test";
import { logger } from "@logger/logger";

/**
 * Service responsible for processing failed test reports and creating JIRA issues.
 * Handles the core business logic of parsing tests, resolving users, and creating bug reports.
 */
export class JiraFailedTestsService {
	/**
	 * Creates an instance of JiraFailedTestsService.
	 * @param jiraApi - API client for JIRA operations
	 * @param reportParser - Parser for extracting test data from reports
	 * @param userResolver - Resolver for mapping test authors to JIRA account IDs
	 * @param reportUrl - Base URL of the test report for linking in JIRA issues
	 */
	constructor(
		private readonly jiraApi: JiraApi,
		private readonly reportParser: IReportParser,
		private readonly userResolver: IUserResolver,
		private readonly reportUrl: string,
	) {}

	/**
	 * Parses the test report and creates JIRA issues for all failed tests.
	 * Processes each test sequentially to avoid overwhelming the JIRA API.
	 * @param reportPath - Path to the Playwright test report JSON file
	 * @returns Promise that resolves when all tests have been processed
	 */
	async reportFailedTests(reportPath: string): Promise<void> {
		const tests = this.reportParser.parse(reportPath);
		logger.info(`Parsed ${tests.length} failed tests from the report`);

		for (const test of tests) {
			await this.reportSingleTest(test);
		}
	}

	/**
	 * Processes a single test failure and creates a JIRA issue if applicable.
	 * Uses default assignee if test has no author annotation.
	 * @param test - Parsed test data including failure details
	 */
	private async reportSingleTest(test: ParsedTest): Promise<void> {
		const authorEmail = test.author;
		let accountId: string | null;

		if (!authorEmail) {
			logger.warn(
				`No author found for test: ${test.title}, using default assignee`,
			);
			accountId = this.userResolver.getDefaultAccountId();
		} else {
			accountId = this.userResolver.resolveAccountId(authorEmail);

			if (!accountId) {
				logger.warn(
					`No JIRA user mapped for author: ${authorEmail}, using default assignee`,
				);
				accountId = this.userResolver.getDefaultAccountId();
			}
		}

		const issueKey = await this.createJiraIssue(test, accountId);

		if (issueKey) {
			this.logSuccess(issueKey, test.title, accountId);
		}
	}

	/**
	 * Creates a JIRA bug issue for a failed test.
	 * Handles all communication with the JIRA API including duplicate detection.
	 * @param test - Test data to report
	 * @param accountId - JIRA account ID to assign the issue to
	 * @returns JIRA issue key if created successfully, undefined if skipped or failed
	 */
	private async createJiraIssue(
		test: ParsedTest,
		accountId: string,
	): Promise<string | undefined> {
		const issueKey = await this.jiraApi.createJiraBugForFailedTests(
			test.title,
			accountId,
			this.reportUrl,
			test.stack || "No stack trace available",
			test.steps,
			test.expected,
			test.actual,
			test.specId,
		);

		return issueKey;
	}

	/**
	 * Logs successful JIRA issue creation with assignee information.
	 * @param issueKey - Created JIRA issue key (e.g., "ENG-1234")
	 * @param testTitle - Title of the failed test
	 * @param accountId - JIRA account ID the issue was assigned to
	 */
	private logSuccess(
		issueKey: string,
		testTitle: string,
		accountId: string,
	): void {
		const displayName = this.userResolver.getDisplayName(accountId);
		logger.info(
			`Reported ${issueKey} [${testTitle}] assigned to ${displayName}`,
		);
	}
}
