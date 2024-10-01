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
	getStorageStateNewUserAPI,
	getStorageStateUser,
	getStorageStateUserAPI,
} from "@core/auth-mngmt";
import {
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "@constants/credentials";
import { GamdomPages } from "./gamdom-pages";
import { GamdomApi } from "@api/gamdom-api";
import { getCookieHeader } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { StorageStateNewUserOptions } from "@core/api/interfaces/storage-state-new-user-options";
import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";

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

export const storageStateUserAPI: (
	username: string,
	password?: string,
) => Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = (username, password) => ({
	storageState: async ({}, use) => {
		const storageStatePath = await getStorageStateUserAPI(
			username,
			password,
		);
		await use(storageStatePath);
	},
});

export const storageStateNewUserAPI: (
	options?: StorageStateNewUserOptions,
) => Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = ({
	username,
	password,
	email,
	amount = 450000,
	unit = Unit.COINS,
	displayCurrency = Currency.USD,
} = {}) => ({
	storageState: async ({}, use) => {
		const gamdomApi = new GamdomApi();
		const newUser = new RegisterTestData({ username, password, email });

		const storageStatePath = await getStorageStateNewUserAPI(
			newUser.username,
			newUser.password,
			newUser.email,
		);

		const newUserId = (
			await gamdomApi.getBasicInfo(newUser.username, newUser.password)
		).user.id;

		const user1Cookie = getCookieHeader(
			await gamdomApi.authenticateWithExistingUser(
				USER_1_CREDENTIALS.username,
				USER_1_CREDENTIALS.password,
			),
		);

		await gamdomApi.tipUser(newUserId, amount, unit, displayCurrency, {
			Cookie: user1Cookie,
		});

		await use(storageStatePath);
	},
});
