import * as Configuration from "../configuration";

const timestamp = new Date().toISOString();
const buildNumber = process.env.BUILD_NUMBER;
const buildUrl = process.env.BUILD_URL;

const summary =
	`Test Execution [Automation] - ${timestamp} ` +
	(buildNumber ? `- Build #${buildNumber}` : "- Local");
const execution = buildUrl ? `Build URL - ${buildUrl}` : "Local test execution";

export const createExecutionBody = {
	fields: {
		project: {
			key: Configuration.jira.projectKey,
		},
		summary: summary,
		description: execution,
		customfield_10001: "fc17a3f8-a02f-4ff7-a778-04d544af0828",
		assignee: {
			id: "712020:654320ee-3225-462d-b066-57da9c3b7fd5",
		},
		labels: ["qa-automation"],
		issuetype: {
			name: "Test Execution",
		},
	},
};
