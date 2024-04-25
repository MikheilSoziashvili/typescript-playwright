import { Page } from "@playwright/test";
import { HomePage } from "../pages/home-page/home-page";
import { GoogleAuthPage } from "../pages/external/google-auth-page";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "../constants/credentials";
import {
	GOOGLE_AUTH_STATE_FILE_PATH,
	SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	USER_1_AUTH_STATE_FILE_PATH,
} from "../constants/file-paths";

import * as fs from "fs";
import { CredentialsType } from "./types";

const CREDENTIALS_AUTH_STATE_MAP = {
	[GOOGLE_AUTH_CREDENTIALS.username]: GOOGLE_AUTH_STATE_FILE_PATH,
	[SUPER_ADMIN_CREDENTIALS.username]: SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	[USER_1_CREDENTIALS.username]: USER_1_AUTH_STATE_FILE_PATH,
};

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
	const googleAuthPage = new GoogleAuthPage(page);
	await page.goto(baseURL || "/"); //https://github.com/microsoft/playwright/issues/27557#issuecomment-1991479852

	// Applicable only for coder environment
	if (!page.url().includes("google")) {
		return;
	}

	await googleAuthPage.loginToGoogle(
		GOOGLE_AUTH_CREDENTIALS.username,
		GOOGLE_AUTH_CREDENTIALS.password,
	);
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
	const googleAuthPage = new GoogleAuthPage(page);
	await page.goto(baseURL || "/"); //https://github.com/microsoft/playwright/issues/27557#issuecomment-1991479852

	// Applicable only for coder environment
	await googleAuthPage.loginToGoogle(
		GOOGLE_AUTH_CREDENTIALS.username,
		GOOGLE_AUTH_CREDENTIALS.password,
	);
	await homePage.openLoginModal();
	await homePage.loginModal.login(user.username, user.password);
	await homePage.assertThat().userIsLoggedIn();

	await page
		.context()
		.storageState({ path: CREDENTIALS_AUTH_STATE_MAP[user.username] });

	await page.close();

	return CREDENTIALS_AUTH_STATE_MAP[user.username];
}
