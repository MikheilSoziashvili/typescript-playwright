/* eslint-disable @typescript-eslint/ban-types */
import {
	Browser,
	Fixtures,
	Page,
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
	devices,
} from "@playwright/test";
import {
	getStorageStateGoogleAuth,
	getStorageStateUser,
	getStorageStateUserAPI,
} from "@core/auth-mngmt";
import {
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "@constants/credentials";
import * as Configuration from "configuration";
import { GamdomPages } from "./gamdom-pages";

function authPage(browser: Browser): Promise<Page> {
	return browser.newPage({
		...devices["Desktop Chrome"],
		viewport: { width: 1920, height: 1080 },
	});
}

// Preserved in case UI-based login is required
export const storageStateGoogleAuth: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions & GamdomPages,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
	storageState: async ({ browser, baseURL }, use) => {
		await use(
			await getStorageStateGoogleAuth(await authPage(browser), baseURL),
		);
	},
};

// Preserved in case UI-based login is required
export const storageStateUser1: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions & GamdomPages,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
	storageState: async ({ browser, baseURL }, use) => {
		await use(
			await getStorageStateUser(
				USER_1_CREDENTIALS,
				await authPage(browser),
				baseURL,
			),
		);
	},
};

// Preserved in case UI-based login is required
export const storageStateSuperadmin: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions & GamdomPages,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
	storageState: async ({ browser, baseURL }, use) => {
		await use(
			await getStorageStateUser(
				SUPER_ADMIN_CREDENTIALS,
				await authPage(browser),
				baseURL,
			),
		);
	},
};

export const storageStateUser1API: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
	storageState: async ({}, use) => {
		const storageStatePath = await getStorageStateUserAPI(
			USER_1_CREDENTIALS,
		);
		await use(storageStatePath);
	},
};

export const storageStateSuperadminAPI: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
	storageState: async ({}, use) => {
		const storageStatePath = await getStorageStateUserAPI(
			SUPER_ADMIN_CREDENTIALS,
		);
		await use(storageStatePath);
	},
};
