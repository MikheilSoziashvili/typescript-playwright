import { WICKED_GAMES_AUTH } from "@constants/auth-casino-game-providers";
import { buildFreeSpinsRewardNotificationSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import { FileKey } from "@core/types/types";
import {
	buildRewardCsvVariants,
	readFsAndDenomFromCsv,
} from "@core/utils/generating-reward-csv-utils";
import {
	formatLocalizedDate,
	parseRelativeDateRelation,
	setAuthenticationCookies,
	useProviderBearerFromAuthenticate,
} from "@core/utils/utils";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CasinoGameName } from "@enums/casino-game";
import { CsvFilesName } from "@enums/csv-file-name";
import { Currency } from "@enums/currencies";
import { ExpectedResultLogsKey } from "@enums/expected-reward-logs";
import { ExpectedResultToastKey } from "@enums/expected-reward-toast-keys";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { NotificationButton } from "@enums/notification-buttons";
import { NotificationTitle } from "@enums/notification-titles";
import { TestTag } from "@enums/test-tags";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { BookOfArabiaPage } from "@pages/casino-games/wickedgames/book-of-arabia/book-of-arabia-page";
import { CasinoPage } from "@pages/casino/casino-game-page";
import { HomePage } from "@pages/home-page/home-page";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
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

		test.describe("Revoke free spins", () => {
			const startDateOffset = 1;
			const endDateOffset = 7;
			const betAmount = 200;

			test(
				"[ENG-7506] Revoking free spins promotion reward",
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
				async ({
					gamdomApiDbFacade,
					browser,
					evRewardsSystemAdminPage,
					toast,
					gamdomDb,
					userInfoAdminPage,
					userInfoRewardsAdminPage,
				}) => {
					const { user: userData, cookie: userCookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							emailVerified: true,
						});

					const userContext = await browser.newContext();

					const userPage = await userContext.newPage();
					await setAuthenticationCookies(userPage, userCookie);

					await useProviderBearerFromAuthenticate(userPage, {
						host: WICKED_GAMES_AUTH.HOST,
						authPath: WICKED_GAMES_AUTH.AUTH_PATH,
						tokenJsonKey: WICKED_GAMES_AUTH.TOKEN_KEY,
					});

					await evRewardsSystemAdminPage
						.steps()
						.navigateAndCheckRewardTypeElements();
					await evRewardsSystemAdminPage
						.steps()
						.selectFreeSpinsAndCheckElements();
					await evRewardsSystemAdminPage
						.steps()
						.pickStartDate(startDateOffset);
					await evRewardsSystemAdminPage
						.steps()
						.pickEndDate(endDateOffset);

					const dynamicFileMap = buildRewardCsvVariants({
						ids: [String(userData.userId)],
					});
					const uploadPath = await evRewardsSystemAdminPage
						.steps()
						.resolveUploadPath(
							Object.keys(dynamicFileMap)[0] as FileKey,
							dynamicFileMap,
						);

					const { fs: freeSpinsAmount, denom: rewardAmount } =
						readFsAndDenomFromCsv(uploadPath, 1);

					await evRewardsSystemAdminPage.bulkRewardFileUpload(
						uploadPath,
					);
					await evRewardsSystemAdminPage.clickRewardUsersButton();
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);
					await toast
						.assertThat()
						.subTitleIs(ToastSubTitle.PROCESSED_OK);

					await gamdomDb.updateRewardStatus(
						userData.userId,
						RewardStatus.ACTIVE,
					);

					const casinoPage = new CasinoPage(userPage);
					await casinoPage.navigate();
					await casinoPage
						.steps()
						.searchForGameAndOpen(CasinoGameName.BOOK_OF_ARABIA);

					const userBookOfArabiaPage = new BookOfArabiaPage(userPage);
					await userBookOfArabiaPage
						.steps()
						.startGameAndSpin(betAmount);

					const userHomePage = new HomePage(userPage);
					await userHomePage.navigate();

					const notification = userHomePage.getNotification();

					await notification.assertThat().waitForNotification({
						timeout: Timeout.MAX,
					});
					await notification
						.assertThat()
						.titleIs(NotificationTitle.FREE_SPINS_PROMOTION_BONUS);
					await notification.assertThat().subTitleIs(
						buildFreeSpinsRewardNotificationSubTitle(
							freeSpinsAmount,
							rewardAmount,
							formatLocalizedDate({
								daysOffset: endDateOffset,
								includeTime: true,
								atMidnight: true,
							}),
							CasinoGameName.BOOK_OF_ARABIA,
						),
					);
					await notification
						.assertThat()
						.buttonTextIs(NotificationButton.PLAY);

					await userInfoAdminPage.navigate();

					await userInfoAdminPage.searchForSteam64OrUserId(
						userData.userId,
					);

					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.Rewards,
					);

					await userInfoRewardsAdminPage
						.assertThat()
						.rewardVisibleInSectionWithoutValue(
							RewardStatus.ACTIVE,
							CustomRewardType.FREE_SPINS_PROMOTION,
						);

					await userInfoRewardsAdminPage
						.steps()
						.clickRevokeRewardButton(
							RewardStatus.ACTIVE,
							CustomRewardType.FREE_SPINS_PROMOTION,
						);

					await userInfoRewardsAdminPage
						.assertThat()
						.noActiveRewardsVisible(RewardStatus.ACTIVE);
				},
			);
		});
	},
);
