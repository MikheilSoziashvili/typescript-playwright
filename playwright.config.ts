import { ReporterDescription, defineConfig, devices } from "@playwright/test";
import * as Configuration from "./configuration";

/** Read environment variables from file. https://github.com/motdotla/dotenv */
// require('dotenv').config();

/** See https://playwright.dev/docs/test-configuration. */

// When tests are aligned with CI/CD workflow, a more comprehensive report will be selected instead of HTML
function getReporter(): ReporterDescription[] {
	if (Configuration.createExecution) {
		return [
			["junit", { outputFile: Configuration.reportName }],
			["./core/reporters/custom-reporter.ts"], // Custom reporter for XRay/JIRA integration
			["html"],
		];
	} else {
		return [["html"]];
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call -- default config file
export default defineConfig({
	timeout: 2 * 60 * 1000, //convert to minutes
	testDir: "./tests",
	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: getReporter(),
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: "https://gamdom--main--auto1--svetoslav-coder.teamgamdom.com",
		/* HTTP credentials for basic auth on dev servers */
		// httpCredentials: {
		// 	username: "trebleclef",
		// 	password: "|kF$+K7?U_p$",
		// },

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",

		launchOptions: {
			slowMo: 300,
		},

		video: {
			mode: "retain-on-failure",
			size: { width: 1920, height: 1080 },
		},
		screenshot: "only-on-failure",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "global-setup",
			testMatch: /global\.setup\.ts/,
			teardown: "teardown",
		},
		{
			name: "teardown",
			testMatch: /global\.teardown\.ts/,
		},
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1920, height: 1080 },
			},
			dependencies: ["global-setup"],
		},

		// TODO: Test against mobile viewports.
		// TODO: Test against branded browsers.
	],
});
