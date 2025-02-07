import { US_PROXY_CREDENTIALS } from "@constants/proxies";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
} from "@core/utils/utils";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserAPI } from "../fixtures/auth-fixtures";

test.describe("Promo Code tests", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewSuperAdminUserAPI());

	test("[ENG-3966] Promo Code - Require new 2FA code when IP of user changes", async ({
		promoCampaignsAdminPage,
		twoFactorAuthModal,
		promoCodeModal,
		browser,
	}) => {
		let context = await browser.newContext();
		const pages = {
			promoCampaignsAdminPage,
			twoFactorAuthModal,
			promoCodeModal,
		};
		const initialPage = await initializePageObjects(
			context,
			...Object.values(pages),
		);

		await promoCampaignsAdminPage.navigate();
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal.assertThat().isNotDisplayed();
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal.assertThat().isDisplayed();

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: US_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

		await promoCampaignsAdminPage.navigate();
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal.assertThat().isNotDisplayed();
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await promoCampaignsAdminPage.clickCreateCampaignButton();
		await promoCodeModal.assertThat().isDisplayed();
	});
});
