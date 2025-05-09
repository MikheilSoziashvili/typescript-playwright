import { UK_PROXY_CREDENTIALS } from "@constants/proxies";
import { TIP_RAIN } from "@constants/tip-rain";
import { buildTipRainUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	getCookieHeader,
	initializePageObjects,
	initializePageObjectsWithCookies,
	waitUntil,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.beforeEach(async ({ gamdomApi }) => {
	const superAdminData = new RegisterTestData({
		useGamdomEmailDomain: true,
	});

	const superAdminCookie = getCookieHeader(
		await gamdomApi.authenticateWithNewSuperAdminUser(superAdminData),
	);

	await gamdomApi.stopCustomRain({
		Cookie: superAdminCookie,
	});

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
});

test.describe("Tip rain tests", () => {
	let qrCode2FAImagePath: string;
	const tipRainAmount = 10;
	const userData = new RegisterTestData();

	test.afterAll(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(
		storageStateNewUserDB({
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
			await createBrowserContextWithProxy(browser, UK_PROXY_CREDENTIALS),
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
			.verifyModalAndTipRainSuccessfully(tipRainAmount);
		await chat.assertThat().isInfoMessageVisible(
			buildTipRainUserMessageInfo({
				username: userData.username,
				tipRainAmount: tipRainAmount,
			}),
		);
	});

	test.describe("Rain claim tests", () => {
		test.slow();
		const baseRainAmount = 0.67;

		test.use(storageStateNewUserDB());
		test("[ENG-2863] Rain - try to claim the rain", async ({
			homePage,
			chat,
		}) => {
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
		});
	});
});
