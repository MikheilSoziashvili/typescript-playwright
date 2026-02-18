import type { Notification } from "@components/notification/notification";
import {
	buildCashPromoCodeNotificationSubTitle,
	buildCashPromoCodeTransactionsDetailsValue,
	buildFreeSpinsPromoCodeNotificationSubTitle,
	buildFreeSpinsPromoCodeTransactionsDetailsValue,
	buildInformationalCashPromoCodeTransactionsDetailsValue,
} from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	formatLocalizedDate,
	generate2FACodeFromQRCodeImage,
	generateRandomString,
	replaceProdUrl,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { PromoCampaignStatuses } from "@enums/campaign-statuses";
import { CasinoGameCode } from "@enums/casino-game-code";
import { CsvFilesName } from "@enums/csv-file-name";
import { PromoCodeStatusValue } from "@enums/db/campaign-promo-status-value";
import { CampaignPromoType } from "@enums/db/campaign-promo-type";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { LogType } from "@enums/log-types";
import { NotificationButton } from "@enums/notification-buttons";
import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { TestTag } from "@enums/test-tags";
import { ToastSubTitle } from "@enums/toast-subtitles";
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

const freeSpinsAmount = 10;
const rewardAmount = 100;
const reloadDays = 7;

const promoCampaignMatrix = {
	CASH: {
		name: "promo code campaign with cash bonus",
		create: ({
			gamdomDb,
			promoCodeName,
			promoCodeValue,
			adminUserId,
		}: {
			gamdomDb: GamdomDb;
			promoCodeName: string;
			promoCodeValue: string;
			adminUserId: number;
		}) =>
			gamdomDb.createCashPromoCampaign(
				promoCodeName,
				promoCodeValue,
				adminUserId,
				100,
			),
		assert: async ({ notifications }: { notifications: Notification }) => {
			await notifications.assertThat().isDisplayed();
			await notifications
				.assertThat()
				.titleIs(NotificationTitle.PROMO_CODE_BONUS);
			await notifications
				.assertThat()
				.subTitleIs(
					buildCashPromoCodeNotificationSubTitle(rewardAmount),
				);
			await notifications
				.assertThat()
				.buttonTextIs(NotificationButton.OPEN);
		},
	},
	FREE_SPINS: {
		name: "promo code campaign with free spins",
		create: ({
			gamdomDb,
			promoCodeName,
			promoCodeValue,
			adminUserId,
		}: {
			gamdomDb: GamdomDb;
			promoCodeName: string;
			promoCodeValue: string;
			adminUserId: number;
		}) =>
			gamdomDb.createFreeSpinsPromoCampaign(
				promoCodeName,
				promoCodeValue,
				adminUserId,
				CasinoGameCode.MYSTIC_CHIEF.code,
				freeSpinsAmount,
				rewardAmount,
				reloadDays,
			),
		assert: async ({ notifications }: { notifications: Notification }) => {
			await notifications.assertThat().isDisplayed();
			await notifications
				.assertThat()
				.titleIs(NotificationTitle.PROMO_CODE_BONUS);
			await notifications.assertThat().subTitleIs(
				buildFreeSpinsPromoCodeNotificationSubTitle(
					freeSpinsAmount,
					rewardAmount,
					formatLocalizedDate({
						daysOffset: reloadDays,
						includeTime: true,
						atMidnight: true,
					}),
					CasinoGameCode.MYSTIC_CHIEF.name,
				),
			);
			await notifications
				.assertThat()
				.buttonTextIs(NotificationButton.PLAY);
		},
	},
	CASH_RELOAD: {
		name: "promo code campaign with cash reload",
		create: ({
			gamdomDb,
			promoCodeName,
			promoCodeValue,
			adminUserId,
		}: {
			gamdomDb: GamdomDb;
			promoCodeName: string;
			promoCodeValue: string;
			adminUserId: number;
		}) =>
			gamdomDb.createCashReloadPromoCampaign(
				promoCodeName,
				promoCodeValue,
				adminUserId,
				rewardAmount,
			),
		assert: async ({ notifications }: { notifications: Notification }) => {
			await notifications.assertThat().isDisplayed();
			await notifications
				.assertThat()
				.titleIs(NotificationTitle.PROMO_CODE_BONUS);
			await notifications
				.assertThat()
				.subTitleIs(NotificationSubTitle.RELOAD_REWARD);
			await notifications
				.assertThat()
				.buttonTextIs(NotificationButton.OPEN);
		},
	},
} as const;

const promoCampaignVariants = Object.values(promoCampaignMatrix);

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
				testDetails()
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.withJiraBugTickets("8964")
					.apply(),
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

					const code2FA =
						await generate2FACodeFromQRCodeImage(
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
			let promoCodeName: string;
			let adminUserId: number;
			let adminUserCookie: string;

			test.beforeAll(async ({ gamdomApiDbFacade }) => {
				const { user: adminUserData, cookie: adminUserCookieData } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: true,
					});
				adminUserId = adminUserData.userId;
				adminUserCookie = adminUserCookieData;
			});

			test.beforeEach(async () => {
				promoCodeValue = generateRandomString({ length: 7 });
				promoCodeName = generateRandomString({
					length: 5,
				});
			});

			test.afterEach(async ({ gamdomDb }) => {
				await gamdomDb.deletePromoCampaignByPromoCode(promoCodeValue);
			});

			promoCampaignVariants.forEach((promoCampaign) => {
				test(
					`[ENG-2862] Redeem a promo code - ${promoCampaign.name} - shows correct notification`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({
						walletModal,
						homePage,
						gamdomApiDbFacade,
						page,
						gamdomDb,
						toast,
						notifications,
					}) => {
						const { cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth();

						await promoCampaign.create({
							gamdomDb,
							promoCodeName,
							promoCodeValue,
							adminUserId,
						});

						await setAuthenticationCookies(page, cookie);
						await homePage.navigateToWallet();
						await walletModal
							.steps()
							.redeemPromoCodeSuccessfully(promoCodeValue);
						await toast.assertThat().titleIs(ToastTitle.SUCCESS);
						await toast
							.assertThat()
							.subTitleIs(ToastSubTitle.PROMO_CODE_REDEEMED);

						await promoCampaign.assert({ notifications });
					},
				);
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

			promoCampaignVariants.forEach((promoCampaign) => {
				test(
					`[ENG-3739] Redeem a promo code - ${promoCampaign.name} and verify promo codes table is updated`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async ({
						walletModal,
						homePage,
						gamdomApiDbFacade,
						page,
						gamdomDb,
						toast,
						notifications,
						promoCampaignsAdminPage,
					}) => {
						await promoCampaign.create({
							gamdomDb,
							promoCodeName,
							promoCodeValue,
							adminUserId,
						});

						await setAuthenticationCookies(page, adminUserCookie);
						await promoCampaignsAdminPage.navigate();
						await promoCampaignsAdminPage
							.steps()
							.searchPromoCode(promoCodeValue, promoCodeName, 1);
						await promoCampaignsAdminPage
							.assertThat()
							.verifyPromoCodeExactMatch(promoCodeValue);
						await promoCampaignsAdminPage
							.assertThat()
							.verifyPromoCampaignStatus(
								promoCodeName,
								PromoCampaignStatuses.ACTIVE,
							);
						await homePage.navigate({
							cookies: { clearCookies: true },
						});

						const { cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth();

						await setAuthenticationCookies(page, cookie);

						await homePage.navigateToWallet();

						await walletModal
							.steps()
							.redeemPromoCodeSuccessfully(promoCodeValue);

						await toast.assertThat().titleIs(ToastTitle.SUCCESS);
						await toast
							.assertThat()
							.subTitleIs(ToastSubTitle.PROMO_CODE_REDEEMED);

						await promoCampaign.assert({
							notifications,
						});

						await homePage.navigate({
							cookies: { clearCookies: true },
						});
						await setAuthenticationCookies(page, adminUserCookie);
						await promoCampaignsAdminPage.navigate();

						await promoCampaignsAdminPage
							.steps()
							.searchPromoCode(promoCodeValue, promoCodeName, 1);
						await promoCampaignsAdminPage
							.assertThat()
							.verifyPromoCodeExactMatch(promoCodeValue);
						await promoCampaignsAdminPage
							.assertThat()
							.verifyPromoCampaignStatus(
								promoCodeName,
								PromoCampaignStatuses.FINISHED,
							);
					},
				);
			});
		});

		test.describe("Promo code - copy functionality tests", () => {
			let adminUserId: number;
			let adminUserCookie: string;

			test.beforeEach(async ({ gamdomApiDbFacade, page }) => {
				const { user: adminUserData, cookie: adminUserCookieData } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();

				adminUserId = adminUserData.userId;
				adminUserCookie = adminUserCookieData;

				await setAuthenticationCookies(page, adminUserCookie);
			});

			promoCampaignVariants.forEach((promoCampaign) => {
				test(
					`[ENG-6530] [Promo Codes] Verify "Copy Link" button functionality '${promoCampaign.name}'`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({
						page,
						testDataRandom,
						gamdomDb,
						promoCampaignsAdminPage,
						walletModal,
						homePage,
						toast,
					}) => {
						const promoCodeName =
							testDataRandom.data.promoCodes.name();
						const promoCodeValue =
							testDataRandom.data.promoCodes.codeValue();

						await promoCampaign.create({
							gamdomDb,
							promoCodeName,
							promoCodeValue,
							adminUserId,
						});

						await promoCampaignsAdminPage.navigate();
						await promoCampaignsAdminPage
							.steps()
							.searchPromoCode(promoCodeValue, promoCodeName, 1);

						await promoCampaignsAdminPage.clickCopyLinkButtonByName(
							promoCodeName,
						);
						await toast
							.assertThat()
							.toastMessageIs(
								ToastTitle.SUCCESS,
								ToastSubTitle.COPIED_SHARABLE_LINK,
							);

						const copiedLink = await page.evaluate(() =>
							navigator.clipboard.readText(),
						);
						const currentOrigin = new URL(page.url()).origin;
						const newLink = replaceProdUrl(
							copiedLink,
							currentOrigin,
						);

						await homePage.navigate({ link: newLink });
						await toast
							.assertThat()
							.toastMessageIs(
								ToastTitle.SUCCESS,
								ToastSubTitle.PROMO_CODE_REDEEMED,
							);

						await walletModal
							.steps()
							.redeemPromoCode(promoCodeValue);
						await toast
							.assertThat()
							.toastMessageIs(
								ToastTitle.FAILED,
								ToastSubTitle.PROMO_CODE_ERROR_MESSAGE,
							);
					},
				);
			});

			promoCampaignVariants.forEach((promoCampaign) => {
				test(
					`[ENG-6527] [Promo Codes] Verify "Copy code" button functionality '${promoCampaign.name}'`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({
						page,
						gamdomDb,
						promoCampaignsAdminPage,
						walletModal,
						toast,
						homePage,
						notifications,
						testDataRandom,
					}) => {
						const promoCodeName =
							testDataRandom.data.promoCodes.name();
						const promoCodeValue =
							testDataRandom.data.promoCodes.codeValue();

						await promoCampaign.create({
							gamdomDb,
							promoCodeName,
							promoCodeValue,
							adminUserId,
						});

						await promoCampaignsAdminPage.navigate();
						await promoCampaignsAdminPage
							.steps()
							.searchPromoCode(promoCodeValue, promoCodeName, 1);
						await promoCampaignsAdminPage.clickCopyCodeButtonByName(
							promoCodeName,
						);
						await toast
							.assertThat()
							.toastMessageIs(
								ToastTitle.SUCCESS,
								ToastSubTitle.COPIED_CODE,
							);

						const copiedLink = await page.evaluate(() =>
							navigator.clipboard.readText(),
						);

						await homePage.navigateToWallet();
						await walletModal
							.steps()
							.redeemPromoCodeSuccessfully(copiedLink);
						await promoCampaign.assert({ notifications });
					},
				);
			});
		});

		test.describe("Promo codes - campaign management tests", () => {
			const promoCodeTestDataDomain = testData().fromDomain().promoCodes;

			let adminUserId: number;
			let adminUserCookie: string;
			let promoCodesToDelete: string[] = [];
			let promoCodesMap: Record<string, { name: string; value: string }>;

			test.beforeAll(
				async ({ gamdomApiDbFacade, gamdomDb, testDataRandom }) => {
					const { user: adminUserData, cookie: adminUserCookieData } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							userClass: UserClasses.Admin,
							tags: [
								UserTags.PromoCampaignsSuperAdmin,
								UserTags.PromoCampaignsReadAdmin,
							],
							emailVerified: true,
							useGamdomEmailDomain: true,
						});
					adminUserId = adminUserData.userId;
					adminUserCookie = adminUserCookieData;

					promoCodesMap =
						promoCodeTestDataDomain.buildPromoCodesMap(
							testDataRandom,
						);

					promoCodesToDelete = Object.values(promoCodesMap).map(
						(c) => c.value,
					);

					for (const {
						promoType,
						status,
					} of promoCodeTestDataDomain.campaignManagementScenarios) {
						const { name, value } =
							promoCodesMap[`${promoType}_${status}`];
						await promoCampaignMatrix[
							promoType as keyof typeof promoCampaignMatrix
						].create({
							gamdomDb: gamdomDb,
							promoCodeName: name,
							promoCodeValue: value,
							adminUserId: adminUserId,
						});
					}
				},
			);

			test.afterAll(async ({ gamdomDb }) => {
				for (const promoCodeValue of promoCodesToDelete) {
					await gamdomDb.deletePromoCampaignByPromoCode(
						promoCodeValue,
					);
				}
				promoCodesToDelete = [];
			});

			testData()
				.fromCsvParsed({ file: CsvFilesName.PROMO_CAMPAIGN_UPDATE })
				.forEach((input) => {
					test(
						`[ENG-3334] Manage promo campaign - ${input.promoType} - ${input.finalStatus}`,
						testDetails()
							.withAuthor(JiraUser.RALUCA_ARITON)
							.apply(),
						async ({ page, promoCampaignsAdminPage }) => {
							const {
								name: promoCodeName,
								value: promoCodeValue,
							} = promoCodeTestDataDomain.getPromoCode(
								promoCodesMap,
								input.promoType,
								input.finalStatus,
							);

							await setAuthenticationCookies(
								page,
								adminUserCookie,
							);
							await promoCampaignsAdminPage.navigate();
							await promoCampaignsAdminPage
								.steps()
								.searchPromoCode(
									promoCodeValue,
									promoCodeName,
									1,
								);
							await promoCampaignsAdminPage.clickActionButton(
								promoCodeName,
								input.firstAction,
							);
							await promoCampaignsAdminPage.searchPromoCode();

							await promoCampaignsAdminPage
								.assertThat()
								.verifyPromoCampaignStatus(
									promoCodeName,
									input.intermediateStatus,
								);

							await promoCampaignsAdminPage.clickActionButton(
								promoCodeName,
								input.finalAction,
							);
							await promoCampaignsAdminPage.searchPromoCode();

							await promoCampaignsAdminPage
								.assertThat()
								.verifyPromoCampaignStatus(
									promoCodeName,
									input.finalStatus,
								);
						},
					);
				});
		});
	},
);
