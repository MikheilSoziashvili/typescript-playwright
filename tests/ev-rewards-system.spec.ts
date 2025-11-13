import { WICKED_GAMES_AUTH } from "@constants/auth-casino-game-providers";
import {
	FREE_SPINS_REWARD_MILESTONES,
	REVOKE_FREE_SPINS_FILE_PATH,
} from "@constants/file-paths";
import { buildFreeSpinsRewardNotificationSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import { FileKey } from "@core/types/types";
import { buildCsvFromTemplate } from "@core/utils/csv-utils/csv-generator-utils";
import {
	buildRewardCsvVariants,
	readFsAndDenomFromCsv,
} from "@core/utils/csv-utils/generating-reward-csv-utils";
import {
	formatLocalizedDate,
	getISODate,
	parseRelativeDateRelation,
	useProviderBearerFromAuthenticate
} from "@core/utils/utils";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CasinoGameName } from "@enums/casino-game";
import { CasinoGameCode } from "@enums/casino-game-code";
import { CsvFilesName } from "@enums/csv-file-name";
import { Currency } from "@enums/currencies";
import { EvRewardTypes } from "@enums/ev-reward-types";
import { ExpectedResultLogsKey } from "@enums/expected-reward-logs";
import { ExpectedResultToastKey } from "@enums/expected-reward-toast-keys";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { NotificationButton } from "@enums/notification-buttons";
import { NotificationTitle } from "@enums/notification-titles";
import { RewardCardButton } from "@enums/reward-card-buttons";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { predefined } from "test-data/sources/predefined/index";
import { testData } from "test-data/test-data-manager";

test.describe(
	"EV Rewards system tests",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test.use(
			storageStateNewSuperAdminUserDB({
				amount: SUPER_HIGH_USER_AMOUNT,
			}),
		);

		test.describe(
			"Grant free spins via CSV",
			testDetails().withTags(TestTag.SEQUENTIAL).apply(),
			() => {
				test.describe.configure({ mode: "serial" });
				let rewardUserIds: string[] = [];
				let dynamicFileMap: Partial<Record<FileKey, string>> = {};

				test.beforeAll(async ({ gamdomApiDbFacade }) => {
					const created = await gamdomApiDbFacade.createUsersDb({
						usersCount: 1000,
					});
					rewardUserIds = created.map((u) => String(u.userId));

					dynamicFileMap = buildRewardCsvVariants({
						ids: rewardUserIds,
					});
				});

				testData()
					.fromCsvRaw({
						file: CsvFilesName.EV_REWARD_FREE_SPINS_PROMOTION,
					})
					.forEach((input) => {
						test(
							`[ENG-7499] Granting free spins promotion reward for case '${input.iterationName}'`,
							testDetails()
								.withAuthor(JiraUser.RALUCA_ARITON)
								.apply(),
							async ({
								evRewardsSystemAdminPage,
								userBalanceHandler,
							}) => {
								await evRewardsSystemAdminPage
									.steps()
									.navigateAndCheckRewardTypeElements();

								const balanceBefore =
									await userBalanceHandler.walletBalanceInFiatRounded(
										Unit.COINS,
										Currency.USD,
										WalletType.DEFAULT,
									);

								await evRewardsSystemAdminPage
									.steps()
									.selectFreeSpinsAndCheckElements();

								await evRewardsSystemAdminPage
									.steps()
									.pickDatesByRelations(
										parseRelativeDateRelation(
											input.startDate,
										),
										parseRelativeDateRelation(
											input.endDate,
										),
									);

								const uploadPath =
									await evRewardsSystemAdminPage
										.steps()
										.resolveUploadPath(
											input.fileKey as FileKey,
											dynamicFileMap,
										);
								await evRewardsSystemAdminPage.bulkRewardFileUpload(
									uploadPath,
								);
								await evRewardsSystemAdminPage.clickRewardUsersButton();

								const resultKey =
									input.expectedResult as ExpectedResultToastKey;
								await evRewardsSystemAdminPage
									.assertThat()
									.expectToastByFileKey(
										resultKey,
										input.fileKey as FileKey,
									);

								await evRewardsSystemAdminPage
									.assertThat()
									.assertLogs(
										input.expectedLogs as ExpectedResultLogsKey,
									);

								const csvPayout = await evRewardsSystemAdminPage
									.steps()
									.computePayoutForCase(
										uploadPath,
										resultKey,
									);

								const balanceAfter =
									await userBalanceHandler.walletBalanceInFiatRounded(
										Unit.COINS,
										Currency.USD,
										WalletType.DEFAULT,
									);

								const shouldDeduct =
									await evRewardsSystemAdminPage
										.steps()
										.shouldDeductBalance(resultKey);

								logger.info(
									`Balance before: ${balanceBefore}, Payout: ${csvPayout}, Balance after: ${balanceAfter}`,
								);

								await evRewardsSystemAdminPage
									.assertThat()
									.finalBalanceIsCorrect(
										balanceBefore,
										csvPayout,
										balanceAfter,
										shouldDeduct,
									);
							},
						);
					});
			},
		);
	},
);

test.describe("Revoke free spins", () => {
	test(
		"[ENG-7506] Revoking free spins promotion reward",
		testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
		async ({ browserSessionManager, gamdomDb, testDataObject }) => {
			const superAdmin = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
			);
			const regular = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
			);

			const { outAbsPath: csvPath } = buildCsvFromTemplate(
				REVOKE_FREE_SPINS_FILE_PATH,
				[String(regular.getAuthenticatedUser().user.userId)],
			);

			await useProviderBearerFromAuthenticate(regular.page, {
				host: WICKED_GAMES_AUTH.HOST,
				authPath: WICKED_GAMES_AUTH.AUTH_PATH,
				tokenJsonKey: WICKED_GAMES_AUTH.TOKEN_KEY,
			});

			const betTestData = testDataObject.bet.build(
				{ username: regular.getAuthenticatedUser().user.username },
				{ betAmount: 100 },
			);

			await superAdmin.pages.evRewardsSystemAdminPage
				.steps()
				.setConditionsForFreeSpinsReward(
					predefined.freeSpinsRewardConditions.startDateOffset,
					predefined.freeSpinsRewardConditions.endDateOffset,
				);

			const { fs: freeSpinsAmount, denom: rewardAmount } =
				readFsAndDenomFromCsv(csvPath, 1);

			await superAdmin.pages.evRewardsSystemAdminPage.bulkRewardFileUpload(
				csvPath,
			);
			await superAdmin.pages.evRewardsSystemAdminPage.clickRewardUsersButton();

			await superAdmin.pages.toast
				.assertThat()
				.toastMessageIs(ToastTitle.SUCCESS, ToastSubTitle.PROCESSED_OK);

			await gamdomDb.updateRewardStatus(
				regular.getAuthenticatedUser().user.userId,
				RewardStatus.ACTIVE,
			);

			await regular.pages.casinoPage.navigate();
			await regular.pages.casinoPage
				.steps()
				.searchForGameAndOpen(CasinoGameName.BOOK_OF_ARABIA);

			await regular.pages.bookOfArabiaPage
				.assertThat()
				.ensureGameLoaded();
			await regular.pages.bookOfArabiaPage
				.steps()
				.startGameAndSpin(betTestData.betAmount);

			await regular.pages.homePage.navigate();

			const notification = regular.pages.homePage.getNotification();

			await notification.assertThat().waitForNotification({
				timeout: Timeout.MAX,
			});

			const expectedDescription =
				buildFreeSpinsRewardNotificationSubTitle(
					freeSpinsAmount,
					rewardAmount,
					formatLocalizedDate({
						daysOffset: predefined.freeSpinsRewardConditions.endDateOffset,
						includeTime: true,
						atMidnight: true,
					}),
					CasinoGameName.BOOK_OF_ARABIA,
				);

			await notification
				.assertThat()
				.notificationMessageIs(
					NotificationTitle.FREE_SPINS_PROMOTION_BONUS,
					expectedDescription,
				);
			await notification
				.assertThat()
				.buttonTextIs(NotificationButton.PLAY);

			await regular.pages.notificationsPage.navigate();
			await regular.pages.notificationsPage
				.assertThat()
				.notificationVisibleAndHasTitleAndDescription(
					NotificationTitle.FREE_SPINS_PROMOTION_BONUS,
					expectedDescription,
				);

			await superAdmin.pages.userInfoAdminPage.navigate();

			await superAdmin.pages.userInfoAdminPage.searchForSteam64OrUserId(
				regular.getAuthenticatedUser().user.userId,
			);

			await superAdmin.pages.userInfoAdminPage.clickUserInfoTab(
				UserInfoTabs.Rewards,
			);

			await superAdmin.pages.userInfoRewardsAdminPage
				.assertThat()
				.rewardVisibleInSectionWithoutValue(
					RewardStatus.ACTIVE,
					CustomRewardType.FREE_SPINS_PROMOTION,
				);

			await superAdmin.pages.userInfoRewardsAdminPage
				.steps()
				.clickRevokeRewardButton(
					RewardStatus.ACTIVE,
					CustomRewardType.FREE_SPINS_PROMOTION,
				);

			await superAdmin.pages.userInfoRewardsAdminPage
				.assertThat()
				.noActiveRewardsVisible(RewardStatus.ACTIVE);
		},
	);
});

test.describe("Free spins promotion reward", () => {
	test.slow();
	test(
		"[ENG-7504] Verify that users receive free spins according to configured milestones",
		testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
		async ({ browserSessionManager, gamdomDb, testDataObject }) => {
			const superAdmin = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
			);
			const regular = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
			);

			const { outAbsPath: csvPath } = buildCsvFromTemplate(
				FREE_SPINS_REWARD_MILESTONES,
				[String(regular.getAuthenticatedUser().user.userId)],
			);

			await gamdomDb.createFreeSpinsPromotionReward({
				userId: regular.getAuthenticatedUser().user.userId,
				adminUserId: superAdmin.getAuthenticatedUser().user.userId,
				gameCode: CasinoGameCode.BOOK_OF_ARABIA.code,
				wagerThresholdCoins: 15000,
				freeSpinRounds: 1,
				denominationCoins: 1500,
				status: RewardStatus.PENDING,
				type: EvRewardTypes.FREE_SPINS_PROMOTION,
				amountCoins: 0,
				meta: JSON.stringify({
					rewardType: EvRewardTypes.FREE_SPINS_PROMOTION,
					start_wagered: 0,
				}),
				startDate: getISODate(),
				endDate: getISODate({ daysOffset: 1 }),
			});

			await useProviderBearerFromAuthenticate(regular.page, {
				host: WICKED_GAMES_AUTH.HOST,
				authPath: WICKED_GAMES_AUTH.AUTH_PATH,
				tokenJsonKey: WICKED_GAMES_AUTH.TOKEN_KEY,
			});

			const betTestData = testDataObject.bet.build(
				{ username: regular.getAuthenticatedUser().user.username },
				{ betAmount: 100 },
			);

			await regular.pages.casinoPage.navigate();
			await regular.pages.casinoPage
				.steps()
				.searchForGameAndOpen(CasinoGameName.BOOK_OF_ARABIA);

			await regular.pages.bookOfArabiaPage
				.steps()
				.ensureLoadedAndSpin(betTestData.betAmount);

			await regular.pages.homePage.navigate();

			const notification = regular.pages.homePage.getNotification();

			await notification.assertThat().waitForNotification({
				notificationTitle: NotificationTitle.FREE_SPINS_PROMOTION_BONUS,
				timeout: Timeout.MAX,
			});

			await regular.pages.rewardsPage.navigate();
			await regular.pages.rewardsPage
				.assertThat()
				.verifySpecialRewardCard(CasinoGameName.BOOK_OF_ARABIA, 1);

			await regular.pages.rewardsPage.map
				.rewardCardButton(
					CasinoGameName.BOOK_OF_ARABIA,
					RewardCardButton.GO_TO_GAME,
				)
				.click();

			await regular.pages.bookOfArabiaPage
				.assertThat()
				.ensureGameLoaded();

			await regular.pages.bookOfArabiaPage
				.assertThat()
				.verifyFreeSpinsPopupAndStart(1, { expectedBet: 1 });

			await regular.pages.bookOfArabiaPage.clickSpinButton();

			await regular.pages.bookOfArabiaPage
				.assertThat()
				.verifyFreeSpinsResultAndContinue(1);

			await regular.pages.homePage.navigate();

			await superAdmin.pages.evRewardsSystemAdminPage
				.steps()
				.setConditionsForFreeSpinsReward(
					predefined.freeSpinsRewardConditions.startDateOffset,
					predefined.freeSpinsRewardConditions.endDateOffset,
				);
			await superAdmin.pages.evRewardsSystemAdminPage.bulkRewardFileUpload(
				csvPath,
			);
			await superAdmin.pages.evRewardsSystemAdminPage.clickRewardUsersButton();

			await superAdmin.pages.toast
				.assertThat()
				.toastMessageIs(ToastTitle.SUCCESS, ToastSubTitle.PROCESSED_OK);

			await gamdomDb.updateRewardStatus(
				regular.getAuthenticatedUser().user.userId,
				RewardStatus.ACTIVE,
			);

			await regular.pages.casinoPage.navigate();
			await regular.pages.casinoPage
				.steps()
				.searchForGameAndOpen(CasinoGameName.BOOK_OF_ARABIA);

			await regular.pages.bookOfArabiaPage
				.steps()
				.ensureLoadedAndSpin(betTestData.betAmount);
			await regular.pages.homePage.navigate();
			await notification.assertThat().waitForNotification({
				expectedCount: 5,
				notificationTitle: NotificationTitle.FREE_SPINS_PROMOTION_BONUS,
				timeout: Timeout.MAX,
			});

			await regular.pages.rewardsPage.navigate();
			await regular.pages.rewardsPage
				.assertThat()
				.verifyFreeSpinCardsCount(CasinoGameName.BOOK_OF_ARABIA, 1, 5);

			await regular.pages.rewardsPage
				.steps()
				.clickRewardCardButtonByIndex(
					CasinoGameName.BOOK_OF_ARABIA,
					RewardCardButton.GO_TO_GAME,
					0,
				);

			await regular.pages.bookOfArabiaPage
				.assertThat()
				.ensureGameLoaded();

			await regular.pages.bookOfArabiaPage
				.steps()
				.playAllAvailableFreeSpins(1, 1);
		},
	);
});
