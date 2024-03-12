import { Page, chromium } from "@playwright/test";
import { HomePage } from "../pages/home-page/home-page";
import { GoogleAuthPage } from "../pages/external/google-auth-page";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "../constants/credentials";
import {
	SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	USER_1_AUTH_STATE_FILE_PATH,
} from "../constants/file-paths";

import * as fs from "fs";
import { credentialsType } from "./types";

const CREDENTIALS_AUTH_STATE_MAP = {
	[SUPER_ADMIN_CREDENTIALS.username]: SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	[USER_1_CREDENTIALS.username]: USER_1_AUTH_STATE_FILE_PATH,
};

export async function getStorageStateUser(
	user: credentialsType,
	page: Page,
	baseURL?: string,
) {
	if (fs.existsSync(CREDENTIALS_AUTH_STATE_MAP[user.username])) {
		page.close();
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

	page.close();

	return CREDENTIALS_AUTH_STATE_MAP[user.username];
}
