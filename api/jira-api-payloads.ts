import * as Configuration from "../configuration";

const timestamp = new Date().toISOString();
const buildNumber = process.env.BUILD_NUMBER || "LocalRun";
const summary = `Test Execution [Automation] - ${timestamp} - Build: ${buildNumber}`;

export const createExecutionBody = {
	fields: {
		project: {
			key: Configuration.jira.projectKey,
		},
		summary: summary,
		description: "Tests Execution [Automation]",
		issuetype: {
			name: "Test Execution",
		},
	},
};
