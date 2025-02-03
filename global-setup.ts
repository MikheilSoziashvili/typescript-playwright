import { GamdomApi } from "@api/gamdom-api";
import { JiraApi } from "@api/jira-api";
import { createExecutionBody } from "@api/jira-api-payloads";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { SECURITY_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { getStorageStateUserAPI } from "@core/auth-mngmt";
import { JsonData } from "@core/interfaces";
import {
	generateRandomString,
	getCookieHeader,
	writeToJSONFile,
} from "@core/utils/utils";
import { Feature } from "@enums/feature";
import { HttpStatus } from "@enums/http-status";
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
		expect(response.status()).toBe(HttpStatus.OK);
	});

	logger.info("HILO has been successfully enabled.");
}

async function enablePlinkoFeature(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	const featureResponse = await gamdomApi.setFeatureState(
		Feature.PLINKO,
		{ regular: true, beta: true },
		{ Cookie: cookie },
	);

	featureResponse.forEach((response) => {
		expect(response.status()).toBe(HttpStatus.OK);
	});
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
		expect(response.status()).toBe(HttpStatus.OK);
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
		expect(response.status()).toBe(HttpStatus.OK);
	});

	logger.info("Rewards have been successfully enabled.");
}

async function createKothEvent(
	gamdomApi: GamdomApi,
	event_name: string,
	max_winners: number,
	prize_coins: number,
	cookie: string,
): Promise<void> {
	const createKothEventResponse = await gamdomApi.createKothEvent(
		event_name,
		max_winners,
		prize_coins,
		{ Cookie: cookie },
	);

	expect(createKothEventResponse.status()).toBe(HttpStatus.OK);
	logger.info("New KOTH Event created");
}

async function enableRain(
	gamdomApi: GamdomApi,
	active: boolean,
	extraAmount: number,
	frequencyMins: number,
	maxAmount: number,
	minAmount: number,
	percentExtraAmount: number,
	cookie: string,
): Promise<void> {
	const enableRainResponse = await gamdomApi.enableRain(
		active,
		extraAmount,
		frequencyMins,
		maxAmount,
		minAmount,
		percentExtraAmount,
		{ Cookie: cookie },
	);

	expect(enableRainResponse.status()).toBe(HttpStatus.OK);
	logger.info("New Rain was created");
}

async function updateWithdrawLimits(): Promise<void> {
	const storageStatePath = await getStorageStateUserAPI(
		SUPER_ADMIN_CREDENTIALS.username,
	);

	const browser = await chromium.launch({
		slowMo: 400,
	});

	const context = await browser.newContext({
		storageState: storageStatePath,
		extraHTTPHeaders: {
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

	expect(response.status()).toBe(HttpStatus.CREATED);

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
	await updateWithdrawLimits();
	await enableHiloFeature(gamdomApi, cookie);
	await enableEvBasedRewards(gamdomApi, cookie);
	await enableVaultFeature(gamdomApi, cookie);
	await enablePlinkoFeature(gamdomApi, cookie);
	await createKothEvent(
		gamdomApi,
		generateRandomString({ prefix: "KOTH_automation_", length: 3 }),
		1,
		15000,
		cookie,
	);
	await enableRain(gamdomApi, false, 10000, 20, 1000, 2000, 5, cookie);

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
