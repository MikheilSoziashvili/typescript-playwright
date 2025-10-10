import { Reporter } from "@playwright/test/reporter";
import { reportFailedTests } from "@core/reporters/jira-failed-tests-reporter/jira-failed-tests-reporter";

export default class JiraFailedTestsLocalReporter implements Reporter {
	async onEnd(): Promise<void> {
		await reportFailedTests();
	}
}
