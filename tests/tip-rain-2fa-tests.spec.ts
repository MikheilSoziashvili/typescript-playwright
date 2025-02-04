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
import { Chat } from "@pages/components/chat/chat";
import { TipRainModal } from "@pages/modals/tip-rain-modal/tip-rain-modal";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";
import { storageStateNewUserAPI } from "../fixtures/auth-fixtures";
import { HomePage } from "@pages/home-page/home-page";
import { SettingsPage } from "@pages/settings/settings-page";

test.describe("Tip rain tests", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	const tipRainAmount = 10;
	const userData = new RegisterTestData();

	test.use(
		storageStateNewUserAPI({
			username: userData.username,
			password: userData.password,
			email: userData.email,
		}),
	);

	async function sendTipRainWith2FaCodeAndVerify(
		twoFactorAuthModal: TwoFactorAuthModal,
		tipRainModal: TipRainModal,
		settingsPage: SettingsPage,
		chat: Chat,
		with2FaVerification: boolean,
	) {
		const code2FA = await settingsPage.generate2FACodeFromQRCodeImage(
			qrCode2FAImagePath,
		);
		with2FaVerification
			? await twoFactorAuthModal.steps().enter2FaCodeSuccessfully(code2FA)
			: await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();

		await tipRainModal.assertThat().isDisplayed();
		await tipRainModal.steps().tipRainSuccessfully(tipRainAmount);
		await chat.assertThat().isInfoMessageVisible(
			buildTipRainUserMessageInfo({
				username: userData.username,
				tipRainAmount: tipRainAmount,
			}),
		);
	}

	async function navigateAndSendTipRainMessage(
		homePage: HomePage,
		chat: Chat,
	) {
		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await sendTipRainMessage(chat);
	}

	async function sendTipRainMessage(chat: Chat) {
		await chat.assertThat().isDisplayed();
		await chat.steps().sendMessage(TIP_RAIN);
	}

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

		await navigateAndSendTipRainMessage(homePage, chat);
		await sendTipRainWith2FaCodeAndVerify(
			twoFactorAuthModal,
			tipRainModal,
			settingsPage,
			chat,
			true,
		);
		await sendTipRainMessage(chat);
		await sendTipRainWith2FaCodeAndVerify(
			twoFactorAuthModal,
			tipRainModal,
			settingsPage,
			chat,
			false,
		);

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: NL_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

		await navigateAndSendTipRainMessage(homePage, chat);
		await sendTipRainWith2FaCodeAndVerify(
			twoFactorAuthModal,
			tipRainModal,
			settingsPage,
			chat,
			true,
		);
	});
});
