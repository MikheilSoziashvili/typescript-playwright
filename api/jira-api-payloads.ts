import * as Configuration from "../configuration";

const timestamp = new Date().toISOString();
const buildNumber = process.env.BUILD_NUMBER;
const buildUrl = process.env.BUILD_URL;

const summary =
	`Test Execution [Automation] - ${timestamp} ` +
	(buildNumber ? `- Build: #${buildNumber}` : "- Local");
const execution = buildUrl ? `Build URL - ${buildUrl}` : "Local test execution";

export const createExecutionBody = {
	fields: {
		project: {
			key: Configuration.jira.projectKey,
		},
		summary: summary,
		description: execution,
		issuetype: {
			name: "Test Execution",
		},
	},
};
