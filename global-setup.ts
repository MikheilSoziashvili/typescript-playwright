import { expect } from "@playwright/test";
import { JiraApi } from "@api/jira-api";
import { createExecutionBody } from "@api/jira-api-payloads";
import { getCookieHeader, writeToJSONFile } from "@core/utils/utils";
import { logger } from "@logger/logger";
import * as Configuration from "configuration";
import { JsonData } from "@core/interfaces";
import { GamdomApi } from "@api/gamdom-api";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { Feature } from "@enums/feature";

async function globalSetup(): Promise<void> {
	logger.info("Enabling HILO...");

	const gamdomApi = new GamdomApi();

	const cookie = getCookieHeader(await gamdomApi.authenticateWithExistingUser(
		SUPER_ADMIN_CREDENTIALS.username,
		SUPER_ADMIN_CREDENTIALS.password,
	));

	const featureResponse = await gamdomApi.setFeatureState(
		Feature.HILO,
		{ regular: true, beta: true },
		{ Cookie: cookie },
	);

	expect(featureResponse[0].status()).toBe(200);
	expect(featureResponse[1].status()).toBe(200);

	logger.info("HILO has been successfully enabled.");

	if (Configuration.createExecution) {
		logger.info("Creating a Test Execution in JIRA...");
		const jiraApi = new JiraApi();
		const response = await jiraApi.createExecution(createExecutionBody);

		expect(response.status()).toBe(201);

		const responseBody = (await response.json()) as JsonData;
		const responseKey = responseBody["key"] as string;

		if (!responseKey) {
			logger.info(
				`Response received from JIRA: ${JSON.stringify(responseBody)}`,
			);
			throw new Error("Test execution key is empty or invalid.");
		}

		logger.info(
			`Test Execution with key ${
				responseBody["key"] as string
			} has been created!`,
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
}

export default globalSetup;
