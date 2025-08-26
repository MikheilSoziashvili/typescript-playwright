import { DATASETS_DIR } from "@constants/file-paths";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generateRandomString,
	parse_csv,
} from "@core/utils/utils";
import { PromoCampaignStatusActions } from "@enums/campaign-actions";
import { PromoCampaignStatuses } from "@enums/campaign-statuses";
import { CsvFilesName } from "@enums/csv-file-name";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "../fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";

const promoCampaignStatuses = parse_csv(
	DATASETS_DIR,
	CsvFilesName.PROMO_CAMPAIGN_DUPLICATED_CODES,
) as {
	status: PromoCampaignStatusActions;
}[];

test.describe("Promo Campaign with duplicate codes of finished campaigns tests", () => {
	let qrCode2FAImagePath: string;
	let campaignName: string;
	let campaignCode: string;

	test.beforeEach(
		async ({
			settingsPage,
			promoCampaignsAdminPage,
			promoCodeModal,
			twoFactorAuthModal,
		}) => {
			campaignName = generateRandomString({ length: 5 });
			campaignCode = generateRandomString({ length: 7 });
			qrCode2FAImagePath = createPngImagePath();
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
			await promoCodeModal.assertThat().isDisplayed();
			await promoCodeModal
				.steps()
				.createDefaultCashPromoCodeSuccessfully(
					campaignName,
					campaignCode,
				);
		},
	);
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewSuperAdminUserDB({}));

	promoCampaignStatuses.forEach((promoCampaignStatus) => {
		test(
			`[ENG-4935] Promo Codes - Verify duplicate codes of ${promoCampaignStatus.status} campaigns still work`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({
				promoCampaignsAdminPage,
				promoCodeModal,
				walletModal,
				homePage,
			}) => {
				await promoCampaignsAdminPage
					.steps()
					.changePromoCampaignStatus(
						campaignName,
						promoCampaignStatus.status,
					);
				await promoCampaignsAdminPage.clickCreateCampaignButton();
				await promoCodeModal
					.steps()
					.createDefaultCashPromoCodeSuccessfully(
						campaignName + campaignName,
						campaignCode,
					);
				await homePage.navigateToWallet();
				await walletModal
					.steps()
					.redeemPromoCodeSuccessfully(campaignCode);
			},
		);
	});

	test(
		`[ENG-4935] Promo Codes - Verify duplicate codes of expired campaigns still work`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({
			promoCampaignsAdminPage,
			promoCodeModal,
			walletModal,
			homePage,
			gamdomDb,
			toast,
		}) => {
			await gamdomDb.updateCampaignExpirationDateByName(campaignName);
			await homePage.navigateToWallet();
			await walletModal.steps().redeemPromoCode(campaignCode);
			await toast.assertThat().titleIs(ToastTitle.FAILED);
			await toast
				.assertThat()
				.subTitleIs(ToastSubTitle.PROMO_CODE_ERROR_MESSAGE);
			await promoCampaignsAdminPage.navigate();
			await promoCampaignsAdminPage.clickCreateCampaignButton();
			await promoCampaignsAdminPage
				.assertThat()
				.verifyPromoCampaignStatus(
					campaignName,
					PromoCampaignStatuses.FINISHED,
				);
			await promoCodeModal
				.steps()
				.createDefaultCashPromoCodeSuccessfully(
					campaignName + campaignName,
					campaignCode,
				);
			await homePage.navigateToWallet();
			await walletModal.steps().redeemPromoCodeSuccessfully(campaignCode);
		},
	);
});
