import {
	REPORT_FORMATS,
	HTML_REPORTER_OPTIONS,
	REPORTERS,
} from "@constants/reporter-constants";
import { slackReporterConfig } from "@core/reporters/slack-reporter/slack-reporter";
import { ReporterDescription, defineConfig } from "@playwright/test";
import {
	sequentialParallelTestPattern,
	sequentialTestPattern,
} from "@support/regex-patterns";
import * as Configuration from "configuration";

/** See https://playwright.dev/docs/test-configuration. */

/**
 * Parses ReportPortal attributes from the RP_ATTRS environment variable.
 * Expected format: "key1:value1;key2:value2;key3:value3"
 * Falls back to default attributes if RP_ATTRS is not set.
 */
function getRpAttributes(): { key: string; value: string }[] {
	const rpAttrsEnv = process.env.RP_ATTRS;

	if (rpAttrsEnv) {
		return rpAttrsEnv
			.split(";")
			.filter(Boolean)
			.map((pair) => {
				const [key, ...rest] = pair.split(":");
				return { key: key.trim(), value: rest.join(":").trim() };
			});
	}

	// Fallback attributes for local or non-CI runs
	return [
		{
			key: "env",
			value: Configuration.environment_url || "localhost",
		},
		{
			key: "trigger",
			value: Configuration.isScheduledRun ? "nightly" : "manual",
		},
		{
			key: "branch",
			value: Configuration.branchName || "local",
		},
	];
}

/**
 * ReportPortal Configuration
 * Documentation: https://github.com/reportportal/agent-js-playwright
 *
 * Best practices (per ReportPortal docs):
 * - Launch names should represent WHAT is being tested, not WHEN
 * - Timestamps, branches, and environments go into ATTRIBUTES, not the launch name
 * - This allows ReportPortal to group launches, build trends, and run Auto-Analysis
 */
const rpConfig = {
	endpoint: Configuration.reportPortal.endpoint,
	apiKey: Configuration.reportPortal.apiKey,
	project: Configuration.reportPortal.project,
	launch: Configuration.reportPortal.launchName,

	/**
	 * Support for reusing launch ID across multiple test executions
	 *
	 * Environment variable precedence:
	 * - RP_LAUNCH_ID (set by GitHub Actions) - HIGHEST PRIORITY
	 * - Configuration.reportPortal.launchId (static config value)
	 * - undefined (let ReportPortal create new launch) - DEFAULT
	 */
	launchId: process.env.RP_LAUNCH_ID || Configuration.reportPortal.launchId,

	attributes: getRpAttributes(),

	description: `Automated E2E tests run on ${new Date().toISOString()}${process.env.RP_LAUNCH_ID ? " [Combined Results]" : ""}`,

	// Reporting mode: 'DEFAULT' for Launches page, 'DEBUG' for Debug page
	mode: "DEFAULT",

	// Mark skipped tests as 'To Investigate'
	skippedIssue: false,

	// Enable debug logs for troubleshooting
	debug: false,

	// Print launch UUID for reference
	launchUuidPrint: true,

	// Options: 'STDOUT', 'STDERR', 'FILE', 'ENVIRONMENT'
	launchUuidPrintOutput: "ENVIRONMENT",

	// Disable automatic code reference generation to allow manual test case ID
	autoCodeReference: true,

	// Include Playwright test steps as nested steps in ReportPortal
	includeTestSteps: true,

	// Include Playwright project name in code reference (useful for multi-project setups)
	includePlaywrightProjectNameToCodeReference: false,

	// Attach latest error to test description
	extendTestDescriptionWithLastError: true,
	uploadVideo: false,
	uploadTrace: false,

	// Enable auto-analysis to link similar failures
	autoAnalysis: true,

	// Link to existing defects by test case ID
	autoDefectLink: true,

	// HTTP client configuration (optional)
	restClientConfig: {
		timeout: 30000,

		retry: {
			retries: 1,
			retryDelay: () => 300,
		},
	},
};

/**
 * Configures and returns the list of Playwright reporters based on environment and configuration.
 * Reporters are selected dynamically based on CI environment and feature flags.
 *
 * @returns Array of reporter configurations for Playwright
 */
function getReporter(): ReporterDescription[] {
	const reporters: ReporterDescription[] = [
		[REPORT_FORMATS.LIST],
		[REPORT_FORMATS.HTML, HTML_REPORTER_OPTIONS],
	];

	if (Configuration.reportPortal.enabled) {
		reporters.push(["@reportportal/agent-js-playwright", rpConfig]);
	}

	// Enable blob reporter in CI for report merging
	if (process.env.CI) {
		reporters.unshift([REPORT_FORMATS.BLOB]);
	}

	// Enable JIRA/XRay test execution reporter
	if (Configuration.createExecution) {
		reporters.push(
			[REPORT_FORMATS.JUNIT, { outputFile: Configuration.reportName }],
			[REPORTERS.JIRA],
		);
	}

	// This is intentionally controlled by a configuration flag (not an environment variable)
	// to avoid accidental activation in CI/CD.
	// To test JIRA reporting locally, set `enableLocalJiraFailedTestsReporter` to true in your configuration.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (Configuration.enableLocalJiraFailedTestsReporter) {
		reporters.push(
			[
				REPORT_FORMATS.JSON,
				{ outputFile: Configuration.jiraFailedTestsReportName },
			],
			[REPORTERS.LOCAL_JIRA_FAILED],
		);
	}

	// Enable Slack reporter
	if (Configuration.slackReporter) {
		reporters.push(slackReporterConfig(Configuration.slack));
	}

	return reporters;
}

export default defineConfig({
	timeout: 3 * 60 * 1000, //convert to minutes
	testDir: "./tests",
	expect: {
		timeout: 25 * 1000,
		toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 1 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: getReporter(),
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	globalSetup: require.resolve("./global-setup"),
	/* Global setup. */
	globalTeardown: require.resolve("./global-teardown"),
	/* Gobal teardown. */
	use: {
		viewport: { width: 1920, height: 1080 },
		actionTimeout: 25 * 1000,
		navigationTimeout: 40 * 1000,
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: Configuration.environment_url,
		/* HTTP credentials for basic auth on dev servers */
		// httpCredentials: {
		// 	username: "trebleclef",
		// 	password: "|kF$+K7?U_p$",
		// },

		extraHTTPHeaders: {
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		},

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "retain-on-failure",

		launchOptions: {
			slowMo: 300,
			args: ["--disable-blink-features=AutomationControlled"],
		},

		video: {
			mode: "retain-on-failure",
			size: { width: 1920, height: 1080 },
		},
		screenshot: "only-on-failure",
		permissions: ["clipboard-read"],
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
			grepInvert: [sequentialTestPattern, sequentialParallelTestPattern],
		},
		{
			name: "chromium-sequential-parallel",
			use: { browserName: "chromium" },
			grep: sequentialParallelTestPattern,
			fullyParallel: true,
		},
		{
			name: "chromium-sequential",
			use: { browserName: "chromium" },
			grep: sequentialTestPattern,
			fullyParallel: false,
			workers: 1,
		},
	],
});
