import { JiraFailedTestsReporterFacade } from "../facades/jira-failed-tests-reporter-facade";
import { JiraFailedTestsService } from "../services/jira-failed-tests-service";
import { JiraUserResolver } from "../resolvers/jira-user-resolver";
import { FileSystemReportValidator } from "../validators/report-validator";
import { ConfigProvider } from "../config/config-provider";
import { JiraApi } from "@api/jira-api";
import { PlaywrightReportParser } from "../parsers/playwright-report-parsers";

/**
 * Factory for creating and wiring up all dependencies for the JIRA Failed Tests Reporter.
 * Implements the Factory pattern for dependency injection and object composition.
 */
export class JiraFailedTestsReporterFactory {
	/**
	 * Creates a fully configured JiraFailedTestsReporterFacade with all dependencies.
	 * This is the main entry point for constructing the reporter with proper dependency injection.
	 *
	 * @returns Configured facade ready to execute the JIRA reporting process
	 *
	 * @example
	 * ```typescript
	 * const reporter = JiraFailedTestsReporterFactory.create();
	 * await reporter.execute();
	 * ```
	 */
	static create(): JiraFailedTestsReporterFacade {
		const configProvider = new ConfigProvider();
		const config = configProvider.getConfig();

		const jiraApi = new JiraApi();
		const reportParser = new PlaywrightReportParser();
		const userResolver = new JiraUserResolver();
		const reportValidator = new FileSystemReportValidator();

		const jiraFailedTestsService = new JiraFailedTestsService(
			jiraApi,
			reportParser,
			userResolver,
			config.reportUrl,
		);

		return new JiraFailedTestsReporterFacade(
			jiraFailedTestsService,
			reportValidator,
			configProvider,
		);
	}
}
