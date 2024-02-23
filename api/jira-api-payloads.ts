import { exec } from "child_process";
import * as Configuration from "../configuration";

const timestamp = new Date().toISOString();
const buildNumber = process.env.BUILD_NUMBER || "local";
const summary = `Test Execution [Automation] - ${timestamp} - Build: #${buildNumber}`;
const execution = `Build URL - ${process.env.BUILD_URL || "N/A"}`;

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
