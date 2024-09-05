import { Page, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page/home-page";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
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

const CREDENTIALS_AUTH_STATE_MAP = {
	[GOOGLE_AUTH_CREDENTIALS.username]: GOOGLE_AUTH_STATE_FILE_PATH,
	[SUPER_ADMIN_CREDENTIALS.username]: SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	[USER_1_CREDENTIALS.username]: USER_1_AUTH_STATE_FILE_PATH,
};

//Deprecated since CF auth introduced
export async function getStorageStateGoogleAuth(
	page: Page,
	baseURL?: string,
): Promise<string | undefined> {
	if (
		fs.existsSync(
			CREDENTIALS_AUTH_STATE_MAP[GOOGLE_AUTH_CREDENTIALS.username],
		)
	) {
		await page.close();
		return CREDENTIALS_AUTH_STATE_MAP[GOOGLE_AUTH_CREDENTIALS.username];
	}

	const homePage: HomePage = new HomePage(page);
	await page.goto(baseURL || "/"); //https://github.com/microsoft/playwright/issues/27557#issuecomment-1991479852

	await homePage
		.assertThat()
		.titleHasText("Gamdom - Top Bitcoin & Crypto Casino!");

	await page.context().storageState({
		path: CREDENTIALS_AUTH_STATE_MAP[GOOGLE_AUTH_CREDENTIALS.username],
	});

	await page.close();

	return CREDENTIALS_AUTH_STATE_MAP[GOOGLE_AUTH_CREDENTIALS.username];
}

export async function getStorageStateUser(
	user: CredentialsType,
	page: Page,
	baseURL?: string,
): Promise<string> {
	if (fs.existsSync(CREDENTIALS_AUTH_STATE_MAP[user.username])) {
		await page.close();
		return CREDENTIALS_AUTH_STATE_MAP[user.username];
	}

	const homePage: HomePage = new HomePage(page);
	await page.goto(baseURL || "/"); //https://github.com/microsoft/playwright/issues/27557#issuecomment-1991479852

	await homePage.unauthenticatedHeader.openLoginModal();
	await homePage.loginModal.login(user.username, user.password);
	await homePage.assertThat().userIsLoggedIn();

	await page
		.context()
		.storageState({ path: CREDENTIALS_AUTH_STATE_MAP[user.username] });

	await page.close();

	return CREDENTIALS_AUTH_STATE_MAP[user.username];
}

export async function getStorageStateUserAPI(
	username: string,
	password: string,
): Promise<string> {
	const gamdomApi = new GamdomApi();

	const response = await gamdomApi.login(username, password);
	expect(response.status(), "Login failed").toBe(200);
	expect(
		response.headers()["set-cookie"],
		"No cookies received from login response",
	).toBeTruthy();

	let path = CREDENTIALS_AUTH_STATE_MAP[username];

	if (!path) {
		path = getFilePath(`${username}.json`, storageStateDir);
		CREDENTIALS_AUTH_STATE_MAP[username] = path;
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
	CREDENTIALS_AUTH_STATE_MAP[newUser.username] = path;

	const context = await gamdomApi.getContext();
	await context.storageState({
		path: path,
	});

	return path;
}
