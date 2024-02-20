import { test as globalSetup, expect } from "@playwright/test";
import { JiraApi } from "../api/jira-api";
import { createExecutionBody } from "../api/jira-api-payloads";
import { writeToJSONFile } from "../utils";
import { logger } from "../logger";
import * as Configuration from "../configuration";
import { JsonData } from "../interfaces";

globalSetup("global setup", async () => {
	if (Configuration.createExecution) {
		logger.info("Creating an Test Execution in JIRA...");
		const jiraApi = new JiraApi();
		const response = await jiraApi.createExecution(createExecutionBody);

		expect(response.status()).toBe(201);

		const responseBody = (await response.json()) as JsonData;

		logger.info(
			`Test Execution with key ${
				responseBody["key"] as string
			} have been created!`,
		);

		const keystore = Configuration.keystore;

		await writeToJSONFile({ issueKey: responseBody["key"] }, keystore);
		await writeToJSONFile(
			{
				createExecution: Configuration.createExecution,
			},
			keystore,
		);
	}
});
