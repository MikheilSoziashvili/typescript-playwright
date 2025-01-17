import { GamdomApi } from "@api/gamdom-api";
import { JiraApi } from "@api/jira-api";
import { createExecutionBody } from "@api/jira-api-payloads";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { SECURITY_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { JsonData } from "@core/interfaces";
import { getCookieHeader, writeToJSONFile } from "@core/utils/utils";
import { Feature } from "@enums/feature";
import { logger } from "@logger/logger";
import { SecurityAdminPage } from "@pages/admin/security-admin/security-admin-page";
import { chromium, expect } from "@playwright/test";
import * as Configuration from "configuration";
import { environment_url } from "configuration";
import * as fs from "fs";

async function enableHiloFeature(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	logger.info("Enabling HILO...");

	const featureResponse = await gamdomApi.setFeatureState(
		Feature.HILO,
		{ regular: true, beta: true },
		{ Cookie: cookie },
	);

	featureResponse.forEach((response) => {
		expect(response.status()).toBe(200);
	});

	logger.info("HILO has been successfully enabled.");
}

async function enableVaultFeature(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	const featureResponse = await gamdomApi.setFeatureState(
		Feature.VAULT,
		{ regular: true, beta: true },
		{ Cookie: cookie },
	);

	featureResponse.forEach((response) => {
		expect(response.status()).toBe(200);
	});
}

async function enableEvBasedRewards(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	logger.info("Enabling Rewards...");

	const featureResponse = await gamdomApi.setFeatureState(
		Feature.EV_BASED_REWARDS,
		{ regular: true, beta: true },
		{ Cookie: cookie },
	);

	featureResponse.forEach((response) => {
		expect(response.status()).toBe(200);
	});

	logger.info("Rewards have been successfully enabled.");
}

async function updateWithdrawLimits(cookie: string): Promise<void> {
	const browser = await chromium.launch({ slowMo: 300 });
	const context = await browser.newContext({
		extraHTTPHeaders: {
			Cookie: cookie,
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		},
	});
	const page = await context.newPage();

	const securityAdminPage = new SecurityAdminPage(page);
	await page.goto(`${environment_url}${SECURITY_ADMIN_PAGE_ENDPOINT}`);

	const WITHDRAW_LIMIT = 500000000;

	await securityAdminPage.updateUserWithdrawLimits(
		WITHDRAW_LIMIT,
		WITHDRAW_LIMIT,
	);
	logger.info(`User withdraw limits have been updated to 5 million USD.`);

	await browser.close();
}

async function createJiraExecution(): Promise<void> {
	logger.info("Creating a Test Execution in JIRA...");
	const jiraApi = new JiraApi();
	const response = await jiraApi.createExecution(createExecutionBody);

	expect(response.status()).toBe(201);

	const responseBody = (await response.json()) as JsonData;
	const responseKey = responseBody["key"] as string;

	process.env.TEST_EXECUTION_ID = responseKey;
	logger.info(`TEST_EXECUTION_ID set to: ${process.env.TEST_EXECUTION_ID}`);

	if (!responseKey) {
		logger.error(
			`Invalid response received from JIRA: ${JSON.stringify(
				responseBody,
			)}`,
		);
		throw new Error("Test execution key is empty or invalid.");
	}

	await writeExecutionToKeystore(responseKey);

	logger.info(
		`Test Execution with key ${
			responseBody["key"] as string
		} has been created!`,
	);

	const envFilePath = process.env.GITHUB_ENV;
	if (envFilePath) {
		fs.appendFileSync(envFilePath, `TEST_EXECUTION_ID=${responseKey}\n`);
	}
}

async function writeExecutionToKeystore(issueKey: string): Promise<void> {
	const keystore = Configuration.keystore;
	await writeToJSONFile({ issueKey }, keystore);
	await writeToJSONFile(
		{ createExecution: Configuration.createExecution },
		keystore,
	);
}

async function globalSetup(): Promise<void> {
	const gamdomApi = new GamdomApi();
	const cookie = getCookieHeader(
		await gamdomApi.authenticateWithExistingUser(
			SUPER_ADMIN_CREDENTIALS.username,
			SUPER_ADMIN_CREDENTIALS.password,
		),
	);

	await enableHiloFeature(gamdomApi, cookie);
	await enableEvBasedRewards(gamdomApi, cookie);
	await enableVaultFeature(gamdomApi, cookie);
	await updateWithdrawLimits(cookie);

	if (Configuration.createExecution) {
		const existingKey = process.env.TEST_EXECUTION_ID;
		if (existingKey) {
			logger.info(
				`Using existing Test Execution [${existingKey}] in JIRA`,
			);
			await writeExecutionToKeystore(existingKey);
		} else {
			await createJiraExecution();
		}
	}
}

export default globalSetup;
