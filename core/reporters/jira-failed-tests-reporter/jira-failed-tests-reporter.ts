import { logger } from "@logger/logger";
import { JiraFailedTestsReporterFactory } from "./factories/jira-failed-tests-reporter-factory";

export async function reportFailedTests(): Promise<void> {
	const reporter = JiraFailedTestsReporterFactory.create();
	await reporter.execute();
}

if (require.main === module) {
	const main = async (): Promise<void> => {
		try {
			logger.info("Reporting failed tests in JIRA...");
			await reportFailedTests();
			logger.info("Failed tests reported in JIRA!");
		} catch (error) {
			logger.error(
				`JIRA failed tests reporter crashed: ${String(error)}`,
			);
		}
	};

	void main();
}
