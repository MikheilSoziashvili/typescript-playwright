import { Page, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page/home-page";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
	USER_2_CREDENTIALS,
} from "@constants/credentials";
import {
	GOOGLE_AUTH_STATE_FILE_PATH,
	storageStateDir,
	SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	USER_1_AUTH_STATE_FILE_PATH,
} from "@constants/file-paths";

import * as fs from "fs";
import { CredentialsType } from "./types/types";
import { GamdomApi } from "@api/gamdom-api";
import { RegisterTestData } from "@dtos/test-data";
import { getFilePath } from "./utils/utils";

const AUTH_STATE_PATH = {
	[GOOGLE_AUTH_CREDENTIALS.username]: GOOGLE_AUTH_STATE_FILE_PATH,
	[SUPER_ADMIN_CREDENTIALS.username]: SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	[USER_1_CREDENTIALS.username]: USER_1_AUTH_STATE_FILE_PATH,
};

const CREDENTIALS_MAP = new Map<string, string>([
	[SUPER_ADMIN_CREDENTIALS.username, SUPER_ADMIN_CREDENTIALS.password],
	[USER_1_CREDENTIALS.username, USER_1_CREDENTIALS.password],
	[USER_2_CREDENTIALS.username, USER_2_CREDENTIALS.password],
]);

//Deprecated since CF auth introduced
export async function getStorageStateGoogleAuth(
	page: Page,
	baseURL?: string,
): Promise<string | undefined> {
	if (fs.existsSync(AUTH_STATE_PATH[GOOGLE_AUTH_CREDENTIALS.username])) {
		await page.close();
		return AUTH_STATE_PATH[GOOGLE_AUTH_CREDENTIALS.username];
	}

	const homePage: HomePage = new HomePage(page);
	await page.goto(baseURL || "/"); //https://github.com/microsoft/playwright/issues/27557#issuecomment-1991479852

	await homePage
		.assertThat()
		.titleHasText("Gamdom - Top Bitcoin & Crypto Casino!");

	await page.context().storageState({
		path: AUTH_STATE_PATH[GOOGLE_AUTH_CREDENTIALS.username],
	});

	await page.close();

	return AUTH_STATE_PATH[GOOGLE_AUTH_CREDENTIALS.username];
}

export async function getStorageStateUser(
	user: CredentialsType,
	page: Page,
	baseURL?: string,
): Promise<string> {
	if (fs.existsSync(AUTH_STATE_PATH[user.username])) {
		await page.close();
		return AUTH_STATE_PATH[user.username];
	}

	const homePage: HomePage = new HomePage(page);
	await page.goto(baseURL || "/"); //https://github.com/microsoft/playwright/issues/27557#issuecomment-1991479852

	await homePage.unauthenticatedHeader.openLoginModal();
	await homePage.loginModal.login(user.username, user.password);
	await homePage.assertThat().userIsLoggedIn();

	await page.context().storageState({ path: AUTH_STATE_PATH[user.username] });

	await page.close();

	return AUTH_STATE_PATH[user.username];
}

export async function getStorageStateUserAPI(
	username: string,
	password?: string,
): Promise<string> {
	const gamdomApi = new GamdomApi();

	if (!password) {
		if (CREDENTIALS_MAP.has(username)) {
			password = CREDENTIALS_MAP.get(username);
		} else {
			throw new Error(`No password provided for user ${username}`);
		}
	}

	const response = await gamdomApi.login(username, password);
	expect(response.status(), "Login failed").toBe(200);
	expect(
		response.headers()["set-cookie"],
		"No cookies received from login response",
	).toBeTruthy();

	let path = AUTH_STATE_PATH[username];

	if (!path) {
		path = getFilePath(`${username}.json`, storageStateDir);
		AUTH_STATE_PATH[username] = path;
	}

	const context = await gamdomApi.getContext();
	await context.storageState({
		path: path,
	});

	return path;
}

export async function getStorageStateNewUserAPI(
	username?: string,
	password?: string,
	email?: string,
): Promise<string> {
	const gamdomApi = new GamdomApi();

	const newUser = new RegisterTestData({ username, password, email });

	await gamdomApi.authenticateWithNewUser(newUser);

	const path = getFilePath(`${newUser.username}.json`, storageStateDir);
	AUTH_STATE_PATH[newUser.username] = path;

	const context = await gamdomApi.getContext();
	await context.storageState({
		path: path,
	});

	return path;
}
