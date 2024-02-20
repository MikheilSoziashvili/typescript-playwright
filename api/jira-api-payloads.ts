import * as Configuration from "../configuration";

export const createExecutionBody = {
	fields: {
		project: {
			key: Configuration.jira.projectKey,
		},
		summary: "Test Execution for feature XYZ",
		description: "Description of the Test Execution",
		issuetype: {
			name: "Test Execution",
		},
	},
};
