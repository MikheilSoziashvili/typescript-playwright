import {
	REPORT_FORMATS,
	HTML_REPORTER_OPTIONS,
	REPORTERS,
} from "@constants/reporter-constants";
import { slackReporterConfig } from "@core/reporters/slack-reporter/slack-reporter";
import { ReporterDescription, defineConfig } from "@playwright/test";
import * as Configuration from "configuration";

/** Read environment variables from file. https://github.com/motdotla/dotenv */
// require('dotenv').config();

/** See https://playwright.dev/docs/test-configuration. */

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

	// Enable local JIRA failed tests reporter for debugging
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
		},
		{
			name: "chromium-sequential",
			use: { browserName: "chromium" },
			grep: /@SEQUENTIAL/i,
			fullyParallel: false,
			workers: 1,
		},
	],
});
