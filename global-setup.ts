import { GamdomApi } from "@api/gamdom-api";
import { JiraApi } from "@api/jira-api";
import { createExecutionBody } from "@api/jira-api-payloads";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { ALL_USER_TYPES_ENABLED } from "@constants/feature-configurations";
import { JsonData } from "@core/interfaces";
import {
	generateRandomString,
	getCookieHeader,
	writeToJSONFile,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { KothEventName } from "@enums/db/koth-event-types";
import { WithdrawLimitsSettingsValues } from "@enums/db/withdraw-settings-values";
import { Feature } from "@enums/feature";
import { HttpStatus } from "@enums/http-status";
import { logger } from "@logger/logger";
import { expect } from "@playwright/test";
import * as Configuration from "configuration";
import { GamdomDb } from "database/gamdom-db";
import * as fs from "fs";
import { KOTH_NAME_PREFIX } from "@constants/koth";
import { DbServiceManager } from "services/db-pool-service/db-pool-service-manager";

async function enableCoreFeatures(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	logger.info("Enabling core features...");

	await gamdomApi.setAndVerifyFeatureStates(
		[
			{ feature: Feature.HILO, states: ALL_USER_TYPES_ENABLED },
			{
				feature: Feature.EV_BASED_REWARDS,
				states: ALL_USER_TYPES_ENABLED,
			},
			{ feature: Feature.VAULT, states: ALL_USER_TYPES_ENABLED },
			{ feature: Feature.PLINKO, states: ALL_USER_TYPES_ENABLED },
			{ feature: Feature.MINES, states: ALL_USER_TYPES_ENABLED },
			{ feature: Feature.KENO, states: ALL_USER_TYPES_ENABLED },
			{ feature: Feature.PROMOTIONS, states: ALL_USER_TYPES_ENABLED },
			{ feature: Feature.RECENT_WINS, states: ALL_USER_TYPES_ENABLED },
			{
				feature: Feature.AFFILIATES_INFO,
				states: ALL_USER_TYPES_ENABLED,
			},
			{
				feature: Feature.AFFILIATES,
				states: ALL_USER_TYPES_ENABLED,
			},
			{ feature: Feature.PLINKO_BANNER, states: ALL_USER_TYPES_ENABLED },
		],
		{ Cookie: cookie },
	);

	logger.info("Core features have been successfully enabled.");
}

async function enableNewDesignV4Feature(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	logger.info("Enabling New Design V4...");

	const featureResponse = await gamdomApi.setFeatureState(
		Feature.NEW_DESIGN_V4,
		ALL_USER_TYPES_ENABLED,
		{ Cookie: cookie },
	);

	featureResponse.forEach((response) => {
		expect(response.status()).toBe(HttpStatus.OK);
	});

	logger.info("New Design V4 has been successfully enabled.");
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
		undefined,
		{ Cookie: cookie },
	);

	expect(createKothEventResponse.status()).toBe(HttpStatus.OK);
	logger.info("New KOTH Event created");
}

async function updateWithdrawLimits(): Promise<void> {
	const gamdomDb = new GamdomDb();
	const defaultWithdrawLimit = 750000000000; // Default value for 500 million USD in coins

	const withdrawLimits = [
		WithdrawLimitsSettingsValues.Blocked_coins,
		WithdrawLimitsSettingsValues.Alert_coins,
	];

	await gamdomDb.withClient(async () => {
		for (const withdrawLimit of withdrawLimits) {
			const existing = await gamdomDb.getWithdrawLimitFromSettingByKey(
				withdrawLimit,
			);
			if (existing.length > 0) {
				await gamdomDb.updateWithdrawLimitInSetting(
					withdrawLimit,
					defaultWithdrawLimit,
				);
				logger.info(
					`Updated withdraw limit for key "${withdrawLimit}" to: ${defaultWithdrawLimit}`,
				);
			} else {
				await gamdomDb.insertWithdrawLimitInSetting(
					withdrawLimit,
					defaultWithdrawLimit,
				);
				logger.info(
					`Inserted withdraw limit for key "${withdrawLimit}" with value: ${defaultWithdrawLimit}`,
				);
			}
		}
	});
}

export const rainAmount = 15000;
async function configureRain(): Promise<void> {
	const gamdomApi = new GamdomApi();
	const gamdomDb = new GamdomDb();

	const superAdminData = new RegisterTestData({
		useGamdomEmailDomain: true,
	});

	await gamdomDb.createNewUser({
		username: superAdminData.username,
		password: superAdminData.password,
		email: superAdminData.email,
		tags: UserTags.SuperAdmin,
		userClass: UserClasses.Admin,
		emailVerified: true,
	});
	const superAdminCookie = getCookieHeader(
		await gamdomApi.authenticateWithExistingUser(
			superAdminData.username,
			superAdminData.password,
		),
	);

	await gamdomApi.stopCustomRain({
		Cookie: superAdminCookie,
	});

	await gamdomApi.ensureRainExists({
		active: true,
		extraAmount: rainAmount,
		frequencyMins: 1,
		maxAmount: rainAmount,
		minAmount: rainAmount,
		percentExtraAmount: 5,
		headers: {
			Cookie: superAdminCookie,
		},
	});
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

async function ensureKothEventsExist(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	logger.info("Ensuring KOTH scheduled events exist...");

	const gamdomDb = new GamdomDb();
	const scheduledKothEvents = [
		{
			type: KothEventName.DAILY,
			existsMethod: gamdomDb.dailyKothEventExists.bind(gamdomDb),
			createMethod: gamdomDb.insertDailyKothEvent.bind(gamdomDb),
		},
		{
			type: KothEventName.WEEKLY,
			existsMethod: gamdomDb.weeklyKothEventExists.bind(gamdomDb),
			createMethod: gamdomDb.insertWeeklyKothEvent.bind(gamdomDb),
		},
		{
			type: KothEventName.MONTHLY,
			existsMethod: gamdomDb.monthlyKothEventExists.bind(gamdomDb),
			createMethod: gamdomDb.insertMonthlyKothEvent.bind(gamdomDb),
		},
	];

	for (const event of scheduledKothEvents) {
		if (!(await event.existsMethod())) {
			logger.info(`${event.type} KOTH event not found. Creating one...`);
			await event.createMethod();
			logger.info(`${event.type} KOTH event created successfully.`);
		} else {
			logger.info(`${event.type} KOTH event already exists.`);
		}
	}

	const customKothEventName = KOTH_NAME_PREFIX;
	const allAvailableKothEvents =
		await gamdomApi.getCurrentKothEventsBasicInfo({
			Cookie: cookie,
		});

	if (
		!allAvailableKothEvents.some((event) =>
			event.event_name.startsWith(customKothEventName),
		)
	) {
		logger.info(
			"No custom KOTH event found for automation. Creating one...",
		);

		// Create a custom KOTH event for automation
		await createKothEvent(
			gamdomApi,
			generateRandomString({ prefix: customKothEventName, length: 3 }),
			1,
			15000,
			cookie,
		);
	} else {
		logger.info("Custom KOTH event for automation already exists.");
	}
}

async function globalSetup(): Promise<void> {
	await new DbServiceManager().start();
	const gamdomApi = new GamdomApi();
	const cookie = getCookieHeader(
		await gamdomApi.authenticateWithExistingUser(
			SUPER_ADMIN_CREDENTIALS.username,
			SUPER_ADMIN_CREDENTIALS.password,
		),
	);
	await updateWithdrawLimits();
	await configureRain();
	await enableCoreFeatures(gamdomApi, cookie);
	await ensureKothEventsExist(gamdomApi, cookie);

	if (Configuration.enableNewDesignV4Feature) {
		await enableNewDesignV4Feature(gamdomApi, cookie);
	}

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
	} else {
		logger.info("Skipping creation of Test Execution in JIRA");
	}
}

export default globalSetup;
