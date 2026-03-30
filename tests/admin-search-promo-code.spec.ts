import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generateRandomString,
} from "@core/utils/utils";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";

test.describe("Search for Promo codes", () => {
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
			await twoFactorAuthModal
				.steps()
				.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
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

	test.use(storageStateNewSuperAdminUserDB());

	test(
		"[ENG-6184] Search for existing promo code in the campaigns table",
		testDetails()
			.withTags(JiraComponent.PROMO_CODES, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ promoCampaignsAdminPage }) => {
			await promoCampaignsAdminPage
				.steps()
				.searchPromoCode(campaignCode, campaignName, 1);
			await promoCampaignsAdminPage
				.assertThat()
				.verifyPromoCodeExactMatch(campaignCode);
			await promoCampaignsAdminPage.steps().clearSearchInputField();
		},
	);

	test(
		"[ENG-6184] Search for non-existing promo code in the campaigns table",
		testDetails()
			.withTags(JiraComponent.PROMO_CODES, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ promoCampaignsAdminPage }) => {
			const appendToCode = generateRandomString({ length: 3 });
			await promoCampaignsAdminPage
				.steps()
				.searchForNonExistingPromoCode(campaignCode, appendToCode);
			await promoCampaignsAdminPage.assertThat().noDataCellIsDisplayed();
			await promoCampaignsAdminPage
				.assertThat()
				.verifySearchInputIsNotCleared(campaignCode + appendToCode);
		},
	);
});
