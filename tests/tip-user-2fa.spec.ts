import { ChatMessageOptions } from "@components/chat/chat-map";
import { PT_PROXY_CREDENTIALS } from "@constants/proxies";
import { buildTipUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	generateRandomString,
	initializePageObjects,
	initializePageObjectsWithCookies,
	setAuthenticationCookies,
	setContextAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraUser } from "@enums/jira/jira-users";
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

	test.beforeEach(async ({ gamdomApi, gamdomDb, homePage, chat, page }) => {
		qrCode2FAImagePath = createPngImagePath();
		await homePage.navigate({ cookies: { clearCookies: true } });
		await gamdomDb.createNewUser({
			username: newUserData.username,
			password: newUserData.password,
			email: newUserData.email,
			emailVerified: true,
		});
		const cookie = await gamdomApi.authenticateWithExistingUser(
			newUserData.username,
			newUserData.password,
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

	test(
		"[ENG-2562] Tip User - Require new 2FA code when IP of user changes",
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({
			homePage,
			gamdomApi,
			chat,
			tipUserModal,
			toast,
			twoFactorAuthModal,
			settingsPage,
			gamdomDb,
			browser,
		}) => {
			const context = await browser.newContext();
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
			await gamdomDb.createNewUser({
				username: superAdminUserData.username,
				password: superAdminUserData.password,
				email: superAdminUserData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
				emailVerified: true,
			});
			const cookie = await gamdomApi.authenticateWithExistingUser(
				superAdminUserData.username,
				superAdminUserData.password,
			);
			await setContextAuthenticationCookies(context, cookie);

			await settingsPage
				.steps()
				.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
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

			await initializePageObjectsWithCookies(
				await context.cookies(),
				initialPage,
				await createBrowserContextWithProxy(
					browser,
					PT_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

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
		},
	);
});
