import { PT_PROXY_CREDENTIALS } from "@constants/proxies";
import { TIP_RAIN } from "@constants/tip-rain";
import { buildTipRainUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	convertCoinsToUsd,
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	getCookieHeader,
	initializePageObjects,
	initializePageObjectsWithCookies,
	waitUntil,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { rainAmount } from "global-setup";

test.describe("Rain tests", () => {
	const superAdminData = new RegisterTestData({
		useGamdomEmailDomain: true,
	});
	let qrCode2FAImagePath: string;
	const tipRainAmount = 10;
	const baseRainAmount = convertCoinsToUsd(rainAmount);

	test.describe("Rain claim tests", () => {
		test.slow();

		test.use(storageStateNewUserDB());
		test(
			"[ENG-2863] Rain - try to claim the rain",
			testDetails().withJiraBugTickets("5094").apply(),
			async ({ homePage, chat }) => {
				await homePage.navigate();
				await chat.steps().openChatAndVerify();

				const initialAccountBalance =
					await homePage.authenticatedHeader.getAccountBalance();

				await chat.steps().waitUponRainAndClaim();
				await chat.assertThat().rainClaimedMessageIsDisplayed();

				const initialRainBotMessageCount =
					await chat.map.rainBotMessageLocator.count();

				await waitUntil(
					async () =>
						(await chat.map.rainBotMessageLocator.count()) >
						initialRainBotMessageCount,
					{
						errorMessage: "New rain bot message did not appear",
						timeoutSeconds:
							TimeoutSeconds.THIRTY + TimeoutSeconds.ONE_TWENTY,
						intervalSeconds: 2,
					},
				);

				const userCount = await chat.getRainUserCount();
				const expectedUserRainClaim = baseRainAmount / userCount;
				const expectedUserBalance =
					initialAccountBalance + expectedUserRainClaim;

				await homePage.authenticatedHeader
					.assertThat()
					.accountBalanceIs(expectedUserBalance);
			},
		);
	});

	test.describe("Tip rain tests", () => {
		const userData = new RegisterTestData();

		test.use(
			storageStateNewUserDB(
				{
					username: userData.username,
					password: userData.password,
					email: userData.email,
				},
				userData,
			),
		);

		test("[ENG-2564] Tip rain - Require new 2FA code when IP of user changes", async ({
			homePage,
			chat,
			tipRainModal,
			twoFactorAuthModal,
			settingsPage,
			gamdomApi,
			browser,
			gamdomDb,
		}) => {
			const pages = {
				homePage,
				tipRainModal,
				twoFactorAuthModal,
				settingsPage,
				chat,
			};

			await gamdomDb.createNewUser({
				username: superAdminData.username,
				password: superAdminData.password,
				email: superAdminData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
				emailVerified: true,
			});
			const superAdminCookie = getCookieHeader(
				await gamdomApi.authenticateWithExistingUser(
					superAdminData.username,
					superAdminData.password,
				),
			);
			const initialPage = await initializePageObjects(
				await browser.newContext(),
				...Object.values(pages),
			);

			qrCode2FAImagePath = createPngImagePath();
			await settingsPage
				.steps()
				.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);

			await homePage.navigate();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
			await twoFactorAuthModal
				.steps()
				.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
			await tipRainModal
				.steps()
				.verifyModalAndTipRainSuccessfully(
					gamdomApi,
					superAdminCookie,
					tipRainAmount,
				);
			await chat.assertThat().isInfoMessageVisibleByText(
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
				await createBrowserContextWithProxy(
					browser,
					PT_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

			await homePage.navigate();
			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
			await twoFactorAuthModal
				.steps()
				.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
			await tipRainModal
				.steps()
				.verifyModalAndTipRainSuccessfully(
					gamdomApi,
					superAdminCookie,
					tipRainAmount,
				);
			await chat.assertThat().isInfoMessageVisibleByText(
				buildTipRainUserMessageInfo({
					username: userData.username,
					tipRainAmount: tipRainAmount,
				}),
			);
			await deleteFilesWithFilePaths([qrCode2FAImagePath]);
		});
	});
});
