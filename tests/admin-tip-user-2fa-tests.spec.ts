import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserAPI } from "../fixtures/auth-fixtures";
import { buildTipUserSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { emailDomainPattern } from "@support/regex-patterns";
import { GAMDOM_EMAIL_DOMAIN } from "@constants/domains";

test.describe("Tip user through admin panel tests", () => {
	let qrCode2FAImagePath: string;
	const tipAmount = 10;
	const userData = new RegisterTestData();
	const newUserData = new RegisterTestData();

	test.beforeEach(async ({ settingsPage, gamdomApi, gamdomDb }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
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

	test("[ENG-2653] Tip user through admin panel - Require new 2FA code when IP of user changes", async ({
		homePage,
		userInfoAdminPage,
		infoAdminPage,
		twoFactorAuthModal,
		toast,
		browser,
	}) => {
		let context = await browser.newContext();
		const pages = {
			homePage,
			userInfoAdminPage,
			infoAdminPage,
			twoFactorAuthModal,
			toast,
		};
		const initialPage = await initializePageObjects(
			context,
			...Object.values(pages),
		);

		await userInfoAdminPage.navigate();
		await userInfoAdminPage.steps().showUserDetails(newUserData.username);
		await infoAdminPage.steps().tipUser(tipAmount);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: newUserData.username,
				tipAmount: tipAmount,
			}),
			{ index: 3 },
		);
		await infoAdminPage.steps().tipUser(tipAmount);
		await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: newUserData.username,
				tipAmount: tipAmount,
			}),
			{ index: 4 },
		);

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: NL_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

		await userInfoAdminPage.navigate();
		await userInfoAdminPage.steps().showUserDetails(newUserData.username);
		await infoAdminPage.steps().tipUser(tipAmount);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: newUserData.username,
				tipAmount: tipAmount,
			}),
			{ index: 3 },
		);
	});
});
