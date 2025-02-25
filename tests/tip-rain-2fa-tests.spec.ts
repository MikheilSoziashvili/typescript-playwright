import { TIP_RAIN } from "@constants/tip-rain";
import { buildTipRainUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	getCookieHeader,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "../fixtures/auth-fixtures";
import { NL_PROXY_CREDENTIALS } from "@constants/proxies";

test.describe("Tip rain tests", () => {
	let qrCode2FAImagePath: string;
	const tipRainAmount = 10;
	const userData = new RegisterTestData();

	test.beforeEach(async ({ settingsPage, gamdomApi }) => {
		const superAdminData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});
		const superAdminCookie = getCookieHeader(
			await gamdomApi.authenticateWithNewSuperAdminUser(superAdminData),
		);
		await gamdomApi.ensureRainExists({
			active: true,
			extraAmount: 1000,
			frequencyMins: 1,
			maxAmount: 1000,
			minAmount: 1000,
			percentExtraAmount: 5,
			headers: {
				Cookie: superAdminCookie,
			},
		});

		qrCode2FAImagePath = createPngImagePath();
		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
	});

	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(
		storageStateNewUserAPI({
			username: userData.username,
			password: userData.password,
			email: userData.email,
		}),
	);

	test("[ENG-2564] Tip rain - Require new 2FA code when IP of user changes", async ({
		homePage,
		chat,
		tipRainModal,
		twoFactorAuthModal,
		settingsPage,
		browser,
	}) => {
		const pages = {
			homePage,
			tipRainModal,
			twoFactorAuthModal,
			settingsPage,
			chat,
		};
		const initialPage = await initializePageObjects(
			await browser.newContext(),
			...Object.values(pages),
		);

		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await tipRainModal
			.steps()
			.verifyModalAndTipRainSuccessfully(tipRainAmount);
		await chat.assertThat().isInfoMessageVisible(
			buildTipRainUserMessageInfo({
				username: userData.username,
				tipRainAmount: tipRainAmount,
			}),
		);

		await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
		await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();

		await initializePageObjectsWithCookies(
			await (await browser.newContext()).cookies(),
			initialPage,
			await createBrowserContextWithProxy(browser, NL_PROXY_CREDENTIALS),
			...Object.values(pages),
		);

		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await tipRainModal
			.steps()
			.verifyModalAndTipRainSuccessfully(tipRainAmount);
		await chat.assertThat().isInfoMessageVisible(
			buildTipRainUserMessageInfo({
				username: userData.username,
				tipRainAmount: tipRainAmount,
			}),
		);
	});
});
