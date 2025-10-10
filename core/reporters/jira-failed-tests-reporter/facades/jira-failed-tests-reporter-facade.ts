import { JiraFailedTestsService } from "../services/jira-failed-tests-service";
import { IReportValidator } from "../interfaces/report-validator";
import { ConfigProvider } from "../config/config-provider";
import { logger } from "@logger/logger";
import { isScheduledRun } from "configuration";

/**
 * Facade for orchestrating the JIRA failed tests reporting workflow.
 * Coordinates configuration, validation, and execution of the reporting process.
 * Implements the Facade pattern to provide a simplified interface to the complex subsystem.
 */
export class JiraFailedTestsReporterFacade {
	/**
	 * Creates an instance of JiraFailedTestsReporterFacade.
	 * @param jiraFailedTestsService - Service handling JIRA bug creation and reporting logic
	 * @param reportValidator - Validator to check if report file exists
	 * @param configProvider - Provider for reporter configuration
	 */
	constructor(
		private readonly jiraFailedTestsService: JiraFailedTestsService,
		private readonly reportValidator: IReportValidator,
		private readonly configProvider: ConfigProvider,
	) {}

	/**
	 * Executes the JIRA failed tests reporting workflow.
	 * Validates configuration, checks report existence, and triggers the reporting process.
	 * Handles errors and logs appropriate messages at each step.
	 *
	 * Workflow:
	 * 1. Checks if this is a nightly/scheduled run
	 * 2. Validates that the report file exists
	 * 3. Triggers the JIRA reporting process
	 *
	 * @returns Promise that resolves when reporting is complete or skipped
	 */
	async execute(): Promise<void> {
		try {
			const config = this.configProvider.getConfig();

			if (!isScheduledRun) {
				logger.info(
					"Skipping JIRA failed tests reporter – not a nightly run",
				);
				return;
			}

			if (!this.reportValidator.exists(config.reportPath)) {
				logger.error(`Report not found at ${config.reportPath}`);
				return;
			}

			await this.jiraFailedTestsService.reportFailedTests(
				config.reportPath,
			);
		} catch (error) {
			logger.error(`JIRA Reporter failed: ${String(error)}`);
		}
	}
}
