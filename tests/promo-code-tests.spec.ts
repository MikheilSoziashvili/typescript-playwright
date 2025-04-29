import {
	buildCashPromoCodeTransactionsDetailsValue,
	buildFreeSpinsPromoCodeTransactionsDetailsValue,
	buildInformationalCashPromoCodeTransactionsDetailsValue,
} from "@core/helpers/asserter-helpers/text-asserters";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generate2FACodeFromQRCodeImage,
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { LogType } from "@enums/log-types";
import { test } from "@fixtures/fixtures";

test.describe("Promo code log filters tests", () => {
	let qrCode2FAImagePath: string;
	const superAdminUserData = new RegisterTestData({
		useGamdomEmailDomain: true,
	});
	const newUserData = new RegisterTestData();
	const cashCampaignName = generateRandomString({ length: 5 });
	const cashCampaignCode = generateRandomString({ length: 7 });
	const freeSpinsCampaignName = generateRandomString({ length: 5 });
	const freeSpinsCampaignCode = generateRandomString({ length: 7 });

	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test(`[ENG-4833] Promo Codes - Verify that Promo Win Cash & Promo Win Free Spins log filters are working`, async ({
		promoCampaignsAdminPage,
		promoCodeModal,
		walletModal,
		homePage,
		settingsPage,
		twoFactorAuthModal,
		gamdomApi,
		page,
		userInfoAdminPage,
		transactionsAdminPage,
	}) => {
		qrCode2FAImagePath = createPngImagePath();
		await homePage.navigate({ cookies: { clearCookies: true } });
		const superAdminCookie =
			await gamdomApi.authenticateWithNewSuperAdminUser(
				superAdminUserData,
			);
		await setAuthenticationCookies(page, superAdminCookie);

		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
		await promoCampaignsAdminPage.navigate();
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal.assertThat().isNotDisplayed();
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal
			.steps()
			.createDefaultCashPromoCodeSuccessfully(
				cashCampaignName,
				cashCampaignCode,
			);
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal
			.steps()
			.createDefaultFreeSpinsPromoCodeSuccessfully(
				freeSpinsCampaignName,
				freeSpinsCampaignCode,
			);
		await homePage.navigate({ cookies: { clearCookies: true } });
		const newUserCookie = await gamdomApi.authenticateWithNewUser(
			newUserData,
		);
		await setAuthenticationCookies(page, newUserCookie);
		await homePage.navigateToWallet();
		await walletModal.steps().redeemPromoCodeSuccessfully(cashCampaignCode);
		await walletModal
			.steps()
			.redeemPromoCodeSuccessfully(freeSpinsCampaignCode);

		await homePage.navigate({ cookies: { clearCookies: true } });

		const code2FA = await generate2FACodeFromQRCodeImage(
			qrCode2FAImagePath,
		);
		await homePage
			.steps()
			.loginUserWith2FaCodeSuccessfully(
				superAdminUserData.username,
				superAdminUserData.password,
				code2FA,
			);

		await userInfoAdminPage.navigate();
		await userInfoAdminPage.steps().showUserDetails(newUserData.username);
		await transactionsAdminPage.navigateToAdminUserTransactionsPage();

		await transactionsAdminPage
			.steps()
			.filterAndVerifyLogTypes(
				[LogType.PROMO_WIN_FREE_SPINS],
				[
					buildFreeSpinsPromoCodeTransactionsDetailsValue(
						freeSpinsCampaignCode,
					),
				],
				true,
			);

		await transactionsAdminPage
			.steps()
			.filterAndVerifyLogTypes(
				[LogType.PROMO_WIN_CASH],
				[
					buildInformationalCashPromoCodeTransactionsDetailsValue(),
					buildCashPromoCodeTransactionsDetailsValue(
						cashCampaignCode,
					),
				],
				true,
			);

		await transactionsAdminPage
			.steps()
			.filterAndVerifyLogTypes(
				[LogType.PROMO_WIN_CASH, LogType.PROMO_WIN_FREE_SPINS],
				[
					buildInformationalCashPromoCodeTransactionsDetailsValue(),
					buildFreeSpinsPromoCodeTransactionsDetailsValue(
						freeSpinsCampaignCode,
					),
					buildCashPromoCodeTransactionsDetailsValue(
						cashCampaignCode,
					),
				],
				true,
			);
	});
});
