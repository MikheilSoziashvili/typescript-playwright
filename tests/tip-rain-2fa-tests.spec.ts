import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import { TIP_RAIN } from "@constants/tip-rain";
import { buildTipRainUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "../fixtures/auth-fixtures";

test.describe("Tip rain tests", () => {
	let qrCode2FAImagePath: string;
	const tipRainAmount = 10;
	const userData = new RegisterTestData();

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
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
		let context = await browser.newContext({});
		const pages = {
			homePage,
			tipRainModal,
			twoFactorAuthModal,
			settingsPage,
			chat,
		};
		const initialPage = await initializePageObjects(
			context,
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

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: NL_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

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
