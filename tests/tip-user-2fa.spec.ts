import { ChatMessageOptions } from "@components/chat/chat-map";
import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import { buildTipUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generateRandomString,
	initializePageObjects,
	setAuthenticationCookies,
	setContextAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";

test.describe("Tip user 2FA tests", () => {
	let qrCode2FAImagePath: string;
	const superAdminUserData = new RegisterTestData({
		useGamdomEmailDomain: true,
	});
	const newUserData = new RegisterTestData();
	const chatMessage = generateRandomString({ prefix: "automation_message_" });
	const chatUserMessageInfo: ChatMessageOptions = {
		username: newUserData.username,
		message: chatMessage,
	};
	const tipValue = 15;
	const tipUserInfoMessage = buildTipUserMessageInfo({
		senderUsername: superAdminUserData.username,
		receiverUsername: newUserData.username,
		tipAmount: tipValue,
	});

	test.beforeEach(async ({ gamdomApi, homePage, chat, page }) => {
		qrCode2FAImagePath = createPngImagePath();
		await homePage.navigate({ cookies: { clearCookies: true } });
		const cookie = await gamdomApi.authenticateWithNewVerifiedUser(
			newUserData,
		);
		await setAuthenticationCookies(page, cookie);
		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await chat.steps().sendMessage(chatMessage);
		// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
		const workaroundMessage = generateRandomString({
			prefix: "automation_message_",
		});
		await chat.steps().sendMessage(workaroundMessage);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test("[ENG-2562] Tip User - Require new 2FA code when IP of user changes", async ({
		homePage,
		gamdomApi,
		chat,
		tipUserModal,
		toast,
		twoFactorAuthModal,
		settingsPage,
		browser,
	}) => {
		let context = await browser.newContext();
		const pages = {
			homePage,
			tipUserModal,
			chat,
			toast,
			twoFactorAuthModal,
			settingsPage,
		};
		const initialPage = await initializePageObjects(
			context,
			...Object.values(pages),
		);

		await homePage.navigate({ cookies: { clearCookies: true } });
		const cookie = await gamdomApi.authenticateWithNewSuperAdminUser(
			superAdminUserData,
		);
		await setContextAuthenticationCookies(context, cookie);

		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await chat
			.steps()
			.verifyMessageAndOpenTipUserModal(chatUserMessageInfo, false);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await tipUserModal.tipUser(tipValue);
		await chat.assertThat().isInfoMessageVisible(tipUserInfoMessage);

		await chat
			.steps()
			.verifyMessageAndOpenTipUserModal(chatUserMessageInfo, false);
		await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();
		await tipUserModal.tipUser(tipValue);
		await chat.assertThat().isInfoMessageVisible(tipUserInfoMessage);

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: NL_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

		await homePage.navigate();
		await homePage.authenticatedHeader.expandChatIfNotVisible();
		await chat
			.steps()
			.verifyMessageAndOpenTipUserModal(chatUserMessageInfo, false);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await tipUserModal.tipUser(tipValue);
		await chat.assertThat().isInfoMessageVisible(tipUserInfoMessage);
	});
});
