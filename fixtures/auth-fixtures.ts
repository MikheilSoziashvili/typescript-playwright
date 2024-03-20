/* eslint-disable @typescript-eslint/ban-types */
import {
	Fixtures,
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
} from "@playwright/test";
import { Pages } from "./fixtures";
import { getStorageStateUser } from "../core/auth-mngmt";
import {
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "../constants/credentials";

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
				await browser.newPage(),
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
				await browser.newPage(),
				baseURL,
			),
		);
	},
};
