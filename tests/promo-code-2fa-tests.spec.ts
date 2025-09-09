import { JP_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "../fixtures/auth-fixtures";

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

	test.use(storageStateNewSuperAdminUserDB());

	test(
		"[ENG-3966] Promo Code - Require new 2FA code when IP of user changes",
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({
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
				await createBrowserContextWithProxy(
					browser,
					JP_PROXY_CREDENTIALS,
				),
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
		},
	);
});
