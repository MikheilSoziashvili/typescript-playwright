import { GAMDOM_EMAIL_DOMAIN } from "@constants/domains";
import { buildTipUserSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { emailDomainPattern } from "@support/regex-patterns";
import { storageStateNewSuperAdminUserAPI } from "../fixtures/auth-fixtures";
import { NL_PROXY_CREDENTIALS } from "@constants/proxies";

test.describe("Tip user through admin panel tests", () => {
	let qrCode2FAImagePath: string;
	const tipAmount = 10;
	const userData = new RegisterTestData();
	const newUserData = new RegisterTestData();

	test.beforeEach(async ({ settingsPage, gamdomApi, gamdomDb }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
		await gamdomApi.registerUser(newUserData);
		await gamdomDb.updateUserTotalDepositedAmountByUserEmail(
			userData.email
				.replace(emailDomainPattern, GAMDOM_EMAIL_DOMAIN)
				.toLowerCase(),
		);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(
		storageStateNewSuperAdminUserAPI({
			username: userData.username,
			password: userData.password,
			email: userData.email,
		}),
	);

	test("[ENG-2563] Tip user through admin panel - Require new 2FA code when IP of user changes", async ({
		homePage,
		userInfoAdminPage,
		infoAdminPage,
		twoFactorAuthModal,
		toast,
		browser,
	}) => {
		const pages = {
			homePage,
			userInfoAdminPage,
			infoAdminPage,
			twoFactorAuthModal,
			toast,
		};
		const initialPage = await initializePageObjects(
			await browser.newContext(),
			...Object.values(pages),
		);

		await userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(newUserData.username);
		await infoAdminPage
			.steps()
			.tipUserWith2FaFlow(tipAmount, qrCode2FAImagePath);
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: newUserData.username,
				tipAmount: tipAmount,
			}),
		);
		await infoAdminPage.steps().tipUser(tipAmount);
		await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: newUserData.username,
				tipAmount: tipAmount,
			}),
		);

		await initializePageObjectsWithCookies(
			await (await browser.newContext()).cookies(),
			initialPage,
			await createBrowserContextWithProxy(browser, NL_PROXY_CREDENTIALS),
			...Object.values(pages),
		);

		await userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(newUserData.username);
		await infoAdminPage
			.steps()
			.tipUserWith2FaFlow(tipAmount, qrCode2FAImagePath);
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: newUserData.username,
				tipAmount: tipAmount,
			}),
		);
	});
});
