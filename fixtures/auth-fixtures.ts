/* eslint-disable @typescript-eslint/ban-types */
import { GamdomApi } from "@api/gamdom-api";
import {
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "@constants/credentials";
import { GAMDOM_EMAIL_DOMAIN } from "@constants/domains";
import { NewUserOptions } from "@core/api/interfaces/storage-state-new-user-options";
import {
	getStorageStateGoogleAuth,
	getStorageStateNewUserAPI,
	getStorageStateNewUserDB,
	getStorageStateUser,
	getStorageStateUserAPI,
} from "@core/auth-mngmt";
import { getCookieHeader, writeUserDetails } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";
import {
	Browser,
	Fixtures,
	Page,
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
	TestInfo,
	devices,
} from "@playwright/test";
import { emailDomainPattern } from "@support/regex-patterns";
import { GamdomPages } from "./gamdom-pages";
import { GamdomDb } from "database/gamdom-db";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";

const gamdomApi = new GamdomApi();
const gamdomDb = new GamdomDb();

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
	options?: NewUserOptions,
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
	storageState: async ({}, use, testInfo) => {
		const { storageStatePath, newUser, newUserId, user1Cookie } =
			await createNewUserWithStorageState(
				username,
				password,
				email,
				false,
			);

		await tipNewUserAndLogDetails(
			newUserId,
			amount,
			unit,
			displayCurrency,
			user1Cookie,
			testInfo,
			newUser,
		);

		await use(storageStatePath);
	},
});

export const storageStateNewSuperAdminUserAPI: (
	options?: NewUserOptions,
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
	storageState: async ({}, use, testInfo) => {
		const { storageStatePath, newUser, newUserId, user1Cookie } =
			await createNewUserWithStorageState(
				username,
				password,
				email,
				true,
			);

		await gamdomDb.makeUserSuperAdmin(newUserId);
		await gamdomDb.updateUserEmailVerification(newUserId);

		await tipNewUserAndLogDetails(
			newUserId,
			amount,
			unit,
			displayCurrency,
			user1Cookie,
			testInfo,
			newUser,
		);

		await use(storageStatePath);
	},
});

async function createNewUserWithStorageState(
	username?: string,
	password?: string,
	email?: string,
	isEmailWithGamdomDomain?: boolean,
) {
	const newUser = new RegisterTestData({ username, password, email });
	const storageStatePath = await getStorageStateNewUserAPI(
		newUser.username,
		newUser.password,
		isEmailWithGamdomDomain
			? newUser.email.replace(emailDomainPattern, GAMDOM_EMAIL_DOMAIN)
			: newUser.email,
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

	return { storageStatePath, newUser, newUserId, user1Cookie, gamdomApi };
}

async function tipNewUserAndLogDetails(
	newUserId: number,
	amount: number,
	unit: Unit,
	displayCurrency: Currency,
	user1Cookie: string,
	testInfo: TestInfo,
	userData: RegisterTestData,
) {
	await gamdomApi.tipUser(newUserId, amount, unit, displayCurrency, {
		Cookie: user1Cookie,
	});

	writeUserDetails(testInfo.title, testInfo.workerIndex, {
		username: userData.username,
		password: userData.password,
		email: userData.email,
	});
}

export async function createNewUserWithStorageStateDB(
	options: NewUserOptions,
): Promise<{
	storageStatePath: string;
	newUser: RegisterTestData;
	gamdomApi: GamdomApi;
}> {
	const gamdomApi = new GamdomApi();
	const useGamdomEmailDomain = options.isEmailWithGamdomDomain ?? false;

	const newUser = new RegisterTestData({
		username: options.username,
		password: options.password,
		email: options.email,
		useGamdomEmailDomain: useGamdomEmailDomain,
	});

	const storageStatePath = await getStorageStateNewUserDB({
		username: newUser.username,
		email: newUser.email,
		password: newUser.password,
		amount: options.amount,
		startingXp: options.startingXp,
		emailVerified: options.emailVerified,
		totalDeposited: options.totalDeposited,
		unit: options.unit,
		tags: options.tags,
		image: options.image,
		hasLogMessage: options.hasLogMessage,
		userClass: options.userClass,
	});

	return {
		storageStatePath: storageStatePath,
		newUser: newUser,
		gamdomApi: gamdomApi,
	};
}

export const storageStateNewUserDB: (
	options?: NewUserOptions,
) => Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = (options = {}) => ({
	storageState: async ({}, use, testInfo) => {
		const result = await createNewUserWithStorageStateDB(options);
		const storageStatePath = result.storageStatePath;
		const newUser = result.newUser;

		writeUserDetails(testInfo.title, testInfo.workerIndex, {
			username: newUser.username,
			password: newUser.password,
			email: newUser.email,
		});

		await use(storageStatePath);
	},
});

export const storageStateNewSuperAdminUserDB: (
	options?: NewUserOptions,
) => Fixtures<
	{},
	{},
	PlaywrightTestArgs & PlaywrightTestOptions,
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = (options = {}) =>
	storageStateNewUserDB({
		...options,
		emailVerified: true,
		isEmailWithGamdomDomain: true,
		tags: [UserTags.SuperAdmin],
		userClass: UserClasses.Admin,
	});
