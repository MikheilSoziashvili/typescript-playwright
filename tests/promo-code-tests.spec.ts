import {
	buildCashPromoCodeTransactionsDetailsValue,
	buildFreeSpinsPromoCodeTransactionsDetailsValue,
	buildInformationalCashPromoCodeTransactionsDetailsValue,
} from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generate2FACodeFromQRCodeImage,
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { PromoCodeStatusValue } from "@enums/db/campaign-promo-sattus-value";
import { CampaignPromoType } from "@enums/db/campaign-promo-type";
import { JiraUser } from "@enums/jira/jira-users";
import { LogType } from "@enums/log-types";
import { TestTag } from "@enums/test-tags";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { GamdomDb } from "database/gamdom-db";
import { testData } from "test-data/test-data-manager";

const promoCampaignTestData: Record<
	PromoCodeStatusValue,
	{
		create: (args: {
			gamdomDb: GamdomDb;
			promoCodeName: string;
			promoCodeValue: string;
			promoCodeType: CampaignPromoType;
			adminUserId: number;
			userId: number;
		}) => Promise<unknown>;
	}
> = {
	[PromoCodeStatusValue.NOT_ACTIVE]: {
		create: ({
			gamdomDb,
			promoCodeName,
			promoCodeValue,
			promoCodeType,
			adminUserId,
		}) =>
			gamdomDb.createExpiredPromoCampaign(
				promoCodeName,
				promoCodeValue,
				promoCodeType,
				100,
				adminUserId,
			),
	},
	[PromoCodeStatusValue.REDEEMED]: {
		create: ({
			gamdomDb,
			promoCodeName,
			promoCodeValue,
			promoCodeType,
			adminUserId,
			userId,
		}) =>
			gamdomDb.createRedeemedPromoCampaign(
				promoCodeName,
				promoCodeValue,
				promoCodeType,
				100,
				adminUserId,
				userId,
			),
	},
	[PromoCodeStatusValue.NOT_ELIGIBLE]: {
		create: ({
			gamdomDb,
			promoCodeName,
			promoCodeValue,
			promoCodeType,
			adminUserId,
		}) =>
			gamdomDb.createVipOpalRulesPromoCampaign(
				promoCodeName,
				promoCodeValue,
				promoCodeType,
				100,
				adminUserId,
			),
	},
};

test.describe(
	"Promo code tests",
	testDetails().withTags(TestTag.PROMO_CODES).apply(),
	() => {
		test.describe("Promo code log filters tests", () => {
			let qrCode2FAImagePath: string;
			const cashCampaignName = generateRandomString({ length: 5 });
			const cashCampaignCode = generateRandomString({ length: 7 });
			const freeSpinsCampaignName = generateRandomString({ length: 5 });
			const freeSpinsCampaignCode = generateRandomString({ length: 7 });

			test.afterEach(async () => {
				await deleteFilesWithFilePaths([qrCode2FAImagePath]);
			});

			test(
				`[ENG-4833] Promo Codes - Verify that Promo Win Cash & Promo Win Free Spins log filters are working`,
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
				async ({
					promoCampaignsAdminPage,
					promoCodeModal,
					walletModal,
					homePage,
					settingsPage,
					twoFactorAuthModal,
					page,
					userInfoAdminPage,
					transactionsAdminPage,
					gamdomApiDbFacade,
				}) => {
					qrCode2FAImagePath = createPngImagePath();
					await homePage.navigate({
						cookies: { clearCookies: true },
					});

					const {
						user: superAdminUserData,
						cookie: superAdminCookie,
					} = await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: true,
					});
					await setAuthenticationCookies(page, superAdminCookie);

					await settingsPage
						.steps()
						.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
					await promoCampaignsAdminPage.navigate();
					await promoCampaignsAdminPage.clickCreateCampaignButton();
					await promoCodeModal.assertThat().isNotDisplayed();
					await twoFactorAuthModal
						.steps()
						.generateAndEnter2FaCodeSuccessfully(
							qrCode2FAImagePath,
						);
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
					await homePage.navigate({
						cookies: { clearCookies: true },
					});

					const { user: newUserData, cookie: newUserCookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth();

					await setAuthenticationCookies(page, newUserCookie);
					await homePage.navigateToWallet();
					await walletModal
						.steps()
						.redeemPromoCodeSuccessfully(cashCampaignCode);
					await walletModal
						.steps()
						.redeemPromoCodeSuccessfully(freeSpinsCampaignCode);

					await homePage.navigate({
						cookies: { clearCookies: true },
					});

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
					await userInfoAdminPage
						.steps()
						.showUserDetails(newUserData.username);
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
							[
								LogType.PROMO_WIN_CASH,
								LogType.PROMO_WIN_FREE_SPINS,
							],
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
				},
			);
		});

		test.describe("Promo codes - redemption tests", () => {
			let promoCodeValue: string;
			let adminUserId: number;

			test.beforeAll(async ({ gamdomApiDbFacade }) => {
				const { user: adminUserData } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: true,
					});
				adminUserId = adminUserData.userId;
			});

			test.beforeEach(async () => {
				promoCodeValue = generateRandomString({ length: 7 });
			});

			test.afterEach(async ({ gamdomDb }) => {
				await gamdomDb.deletePromoCampaignByPromoCode(promoCodeValue);
			});

			testData()
				.fromCsvRaw({ file: CsvFilesName.PROMO_CODE_FAILED_REDEMPTION })
				.forEach((row) => {
					test(
						`[ENG-3979] Promo Code - Error messages for failed redemption. For promo code with status: '${row.promo_code_status}' and type: '${row.promo_code_type}'`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({
							walletModal,
							homePage,
							gamdomApiDbFacade,
							page,
							gamdomDb,
							toast,
						}) => {
							const promoCodeName = generateRandomString({
								length: 5,
							});

							const { user, cookie } =
								await gamdomApiDbFacade.createSingleUserDbAndAuth();

							await promoCampaignTestData[
								row.promo_code_status
							].create({
								gamdomDb: gamdomDb,
								promoCodeName: promoCodeName,
								promoCodeValue: promoCodeValue,
								promoCodeType: row.promo_code_type,
								adminUserId: adminUserId,
								userId: user.userId,
							});
							await setAuthenticationCookies(page, cookie);
							await homePage.navigateToWallet();
							await walletModal
								.steps()
								.redeemPromoCode(promoCodeValue);
							await toast.assertThat().titleIs(ToastTitle.FAILED);
							await toast.assertThat().subTitleIs(row.error);
						},
					);
				});
		});
	},
);
