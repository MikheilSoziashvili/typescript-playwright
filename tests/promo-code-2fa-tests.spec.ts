import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserAPI } from "../fixtures/auth-fixtures";

test.describe("Promo Code tests", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
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
		const pages = {
			promoCampaignsAdminPage,
			twoFactorAuthModal,
			promoCodeModal,
		};
		const initialPage = await initializePageObjects(
			await browser.newContext(),
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

		await initializePageObjectsWithCookies(
			await (await browser.newContext()).cookies(),
			initialPage,
			await createBrowserContextWithProxy(browser, NL_PROXY_CREDENTIALS),
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
	});
});
