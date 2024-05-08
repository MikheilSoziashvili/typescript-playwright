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
import { Pages } from "./fixtures";
import {
	getStorageStateGoogleAuth,
	getStorageStateUser,
} from "core/auth-mngmt";
import {
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "constants/credentials";
import * as Configuration from "configuration";

function authPage(browser: Browser): Promise<Page> {
	return browser.newPage({
		...devices["Desktop Chrome"],
		viewport: { width: 1920, height: 1080 },
		extraHTTPHeaders: Configuration.cloudflare,
	});
}

export const storageStateGoogleAuth: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions & Pages,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
	storageState: async ({ browser, baseURL }, use) => {
		await use(
			await getStorageStateGoogleAuth(await authPage(browser), baseURL),
		);
	},
};

export const storageStateUser1: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions & Pages,
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

export const storageStateSuperadmin: Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions & Pages,
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
