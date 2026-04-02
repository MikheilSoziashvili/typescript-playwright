import { BrowserUserSession } from "@core/browser-session-mngmt";
import { AuthenticatedUser } from "@core/facades/gamdom-api-db/interfaces";
import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardType } from "@enums/admin/reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { EvRewardTypes } from "@enums/ev-reward-types";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";

test.describe(
	"User info - Rewards History - Custom rewards",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test(
			`[ENG-7179] Custom rewards - reload`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardHappyPathTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await userSession.pages.homePage.navigate();

				await customRewardHappyPathTestFlow.executeReloadLifecycle({
					adminSession: adminSession,
					userSession: userSession,
					targetUsername: targetUsername,
					rewardType: CustomRewardType.RELOAD,
					rewardLabel: CustomRewardType.RELOAD,
					amount: customRewardsData.amount,
					initialAmount: customRewardsData.initialAmount,
				});
			},
		);

		test(
			`[ENG-7179] Custom rewards - vip`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardHappyPathTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await userSession.pages.homePage.navigate();

				await customRewardHappyPathTestFlow.executeVipLifecycle({
					adminSession: adminSession,
					userSession: userSession,
					targetUsername: targetUsername,
					rewardType: CustomRewardType.VIP,
					rewardLabel: CustomRewardType.VIP,
					amount: customRewardsData.amount,
				});
			},
		);

		test(
			`[ENG-7179] Custom rewards - vip - cancel`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardCancelTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await customRewardCancelTestFlow.executeCancel({
					adminSession: adminSession,
					targetUsername: targetUsername,
					rewardType: CustomRewardType.VIP,
					rewardLabel: CustomRewardType.VIP,
					amount: customRewardsData.amount,
					initialStatus: RewardStatus.PENDING,
				});
			},
		);

		test(
			`[ENG-7179] Custom rewards - xp challenge`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardHappyPathTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await userSession.pages.homePage.navigate();

				await customRewardHappyPathTestFlow.executeXpChallengeLifecycle(
					{
						adminSession: adminSession,
						userSession: userSession,
						targetUsername: targetUsername,
						rewardType: CustomRewardType.XP_CHALLENGE,
						rewardLabel: CustomRewardType.XP_CHALLENGE_LABEL,
						amount: customRewardsData.amount,
						evRequired: 0,
					},
				);
			},
		);

		test(
			`[ENG-7179] Custom rewards - xp challenge - cancel`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardCancelTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await customRewardCancelTestFlow.executeCancel({
					adminSession: adminSession,
					targetUsername: targetUsername,
					rewardType: CustomRewardType.XP_CHALLENGE,
					rewardLabel: CustomRewardType.XP_CHALLENGE_LABEL,
					amount: customRewardsData.amount,
					initialStatus: RewardStatus.PENDING,
					evRequired: 0,
				});
			},
		);

		test(
			`[ENG-7179] Custom rewards - kyc verification`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardKycTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await userSession.pages.homePage.navigate();

				await customRewardKycTestFlow.executeKycLifecycle({
					adminSession: adminSession,
					userSession: userSession,
					targetUsername: targetUsername,
					amount: customRewardsData.amount,
				});
			},
		);

		test(
			`[ENG-7179] Custom rewards - kyc verification - cancel`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				customRewardCancelTestFlow,
				testDataPredefined,
			}) => {
				const customRewardsData = testDataPredefined.data.customRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await customRewardCancelTestFlow.executeCancel({
					adminSession: adminSession,
					targetUsername: targetUsername,
					rewardType: CustomRewardType.KYC_VERIFICATION,
					rewardLabel: CustomRewardType.KYC_VERIFICATION_LABEL,
					amount: customRewardsData.amount,
					initialStatus: RewardStatus.ACTIVE,
				});
			},
		);
	},
);

test.describe(
	"User info - Rewards History - Promo campaigns",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test(
			`[ENG-7179] Rewards history - Promo code - cash`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				promoRewardHistoryTestFlow,
				testDataPredefined,
				testDataPredefinedRandom,
			}) => {
				const promoData = testDataPredefined.data.promoCampaigns;
				const campaignData =
					testDataPredefinedRandom.data.rewardPromoCampaigns;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await userSession.pages.homePage.navigate();

				await promoRewardHistoryTestFlow.executeCashPromoRewardHistory({
					adminSession: adminSession,
					userSession: userSession,
					targetUsername: targetUsername,
					campaignName: campaignData.cashCampaignName,
					campaignCode: campaignData.cashCampaignCode,
					expectedAmount: promoData.promoAmount,
				});
			},
		);

		test(
			`[ENG-7179] Rewards history - Promo code - free spins`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				promoRewardHistoryTestFlow,
				testDataPredefined,
				testDataPredefinedRandom,
			}) => {
				const promoData = testDataPredefined.data.promoCampaigns;
				const campaignData =
					testDataPredefinedRandom.data.rewardPromoCampaigns;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await userSession.pages.homePage.navigate();

				await promoRewardHistoryTestFlow.executeFreeSpinsPromoRewardHistory(
					{
						adminSession: adminSession,
						userSession: userSession,
						targetUsername: targetUsername,
						campaignName: campaignData.freeSpinsCampaignName,
						campaignCode: campaignData.freeSpinsCampaignCode,
						expectedFreeSpinsValue: promoData.freeSpinsValue,
					},
				);
			},
		);
	},
);

test.describe(
	"User info - Rewards History - Tips",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		testData()
			.fromDomain()
			.rewards.tipTypes.forEach(({ tipType, rewardType }) => {
				test(
					`[ENG-7179] Rewards history - Tip - ${tipType}`,
					testDetails()
						.withAuthor(JiraUser.NIKOLAY_GENOV)
						.withTags(TestTag.ACCEPTANCE)
						.apply(),
					async ({
						browserSessionManager,
						tipRewardHistoryTestFlow,
						testDataPredefined,
					}) => {
						const tipData = testDataPredefined.data.tipRewards;

						const adminSession =
							await browserSessionManager.loginAs(
								TestUserRole.SUPERADMIN,
								{ reuseContext: true },
							);
						const userSession = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);
						const targetUsername =
							userSession.getAuthenticatedUser().user.username;

						await tipRewardHistoryTestFlow.executeTipAndVerifyHistory(
							{
								adminSession: adminSession,
								targetUsername: targetUsername,
								tipAmount: tipData.tipAmount,
								expectedAmount: tipData.amount,
								tipType: tipType,
								rewardType: rewardType,
							},
						);
					},
				);
			});
	},
);

test.describe(
	"User info - Rewards History - Royalty up and Instant reward",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		let user: AuthenticatedUser;
		let superAdminSession: BrowserUserSession;

		test.beforeEach(
			async ({
				gamdomApiDbFacade,
				page,
				diceGamePage,
				rewardsPage,
				testDataObject,
				testDataPredefined,
				browserSessionManager,
			}) => {
				const royaltyData = testDataPredefined.data.royaltyUpRewards;

				user = await gamdomApiDbFacade.createSingleUserDbAndAuth({
					emailVerified: true,
					startingXp: royaltyData.userBeXpBronze3 - 1,
				});
				await setAuthenticationCookies(page, user.cookie);

				const betTestData = testDataObject.bet.build(
					{ username: user.user.username },
					{
						betAmount: royaltyData.betAmount,
						autoCashoutMultiplier:
							royaltyData.autoCashoutMultiplier,
					},
				);
				await diceGamePage.navigate();
				await diceGamePage.rollDiceWithAmount(betTestData.betAmount);

				await rewardsPage.navigate();
				await rewardsPage
					.assertThat()
					.instantAndRoyaltyUpRewardsAreAvailable();

				superAdminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
				);

				await superAdminSession.pages.userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(user.user.username);
			},
		);

		test(
			`[ENG-7179] Rewards history - Royalty up and instant`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({ rewardsPage, testDataPredefined }) => {
				const royaltyData = testDataPredefined.data.royaltyUpRewards;
				const royaltyUpAmount = royaltyData.royaltyUpAmount;
				const instantRewardAmount = royaltyData.instantRewardAmount;

				await superAdminSession.pages.userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.PENDING,
					);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.PENDING,
					);

				await rewardsPage.claimReward(RewardType.INSTANT);
				await rewardsPage.claimSingleRoyaltyUpReward();

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage.refresh();

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.CLAIMED,
					);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.CLAIMED,
					);
			},
		);

		test(
			`[ENG-7179] Rewards history - Royalty up and instant - cancel`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({ testDataPredefined }) => {
				const royaltyData = testDataPredefined.data.royaltyUpRewards;
				const royaltyUpAmount = royaltyData.royaltyUpAmount;
				const instantRewardAmount = royaltyData.instantRewardAmount;

				await superAdminSession.pages.userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.Rewards,
				);

				await superAdminSession.pages.userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.INSTANT_RAKEBACK,
					);
				await superAdminSession.pages.userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.ROYALTY_UP,
					);

				await superAdminSession.pages.userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.CANCELED,
					);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.CANCELED,
					);
			},
		);
	},
);

test.describe(
	"User info - Rewards History - Weekly and monthly",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test(
			`[ENG-7179] Rewards history - Weekly reward`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				gamdomApi,
				weeklyMonthlyRewardTestFlow,
				testDataPredefined,
			}) => {
				const rewardData = testDataPredefined.data.weeklyMonthlyRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUserId =
					userSession.getAuthenticatedUser().user.userId;
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await weeklyMonthlyRewardTestFlow.executeWeeklyRewardLifecycle({
					adminSession: adminSession,
					userSession: userSession,
					targetUsername: targetUsername,
					targetUserId: targetUserId,
					gamdomApi: gamdomApi,
					rewardCoins: rewardData.weeklyRewardCoins,
					expectedAmount: rewardData.weeklyAmount,
				});
			},
		);

		test(
			`[ENG-7179] Rewards history - Monthly reward`,
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				gamdomApi,
				weeklyMonthlyRewardTestFlow,
				testDataPredefined,
			}) => {
				const rewardData = testDataPredefined.data.weeklyMonthlyRewards;

				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const userSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const targetUserId =
					userSession.getAuthenticatedUser().user.userId;
				const targetUsername =
					userSession.getAuthenticatedUser().user.username;

				await weeklyMonthlyRewardTestFlow.executeMonthlyRewardLifecycle(
					{
						adminSession: adminSession,
						userSession: userSession,
						targetUsername: targetUsername,
						targetUserId: targetUserId,
						gamdomApi: gamdomApi,
						rewardCoins: rewardData.monthlyRewardCoins,
						expectedAmount: rewardData.monthlyAmount,
					},
				);
			},
		);
	},
);

test.describe(
	"User info - Rewards - Custom xp_challenge reward",
	testDetails()
		.withTags(
			JiraComponent.REWARDS,
			JiraComponent.ADMIN_PANEL,
			JiraComponent.USER_INFO,
		)
		.apply(),
	() => {
		test(
			`[ENG-11140] Create and claim xp_challenge reward`,
			testDetails()
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				testDataPredefined,
				xpChallengeTestFlow,
			}) => {
				const evRewardsSystemSuperAdmin =
					await browserSessionManager.loginAs(
						TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
						{ reuseContext: true },
					);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const xpChallengeData = testDataPredefined.data.xpChallenge;

				await xpChallengeTestFlow.adminCreateXpChallenge({
					adminUser: evRewardsSystemSuperAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					evRequired: xpChallengeData.evRequired,
					challengeDuration: xpChallengeData.challengeDuration,
					rewardAmount: xpChallengeData.rewardAmount,
				});

				await xpChallengeTestFlow.userActivateAndClaimXpChallenge({
					user: regularUser,
					betAmount: xpChallengeData.betAmount,
					rewardAmount: xpChallengeData.rewardAmount,
				});
			},
		);
	},
);

test.describe(
	"User info - Rewards - Custom reload reward",
	testDetails()
		.withTags(
			JiraComponent.REWARDS,
			JiraComponent.ADMIN_PANEL,
			JiraComponent.SPECIAL_REWARDS,
		)
		.apply(),
	() => {
		test(
			`[ENG-10167] Reload Reward creation and activation`,
			testDetails()
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				testDataPredefined,
				reloadRewardTestFlow,
			}) => {
				const adminUserInfoAdmin = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const reloadRewardData = testDataPredefined.data.reloadReward;

				await reloadRewardTestFlow.adminCreateReloadReward({
					adminUser: adminUserInfoAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					amount: reloadRewardData.amount,
				});

				await reloadRewardTestFlow.userActivateReloadReward({
					user: regularUser,
					amount: reloadRewardData.amount,
				});

				await reloadRewardTestFlow.adminVerifyReloadRewardIsActive({
					adminUser: adminUserInfoAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					totalAmount: reloadRewardData.totalAmount,
				});
			},
		);

		test(
			`[ENG-10170] Change Reload Reward`,
			testDetails()
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				gamdomDb,
				changeReloadRewardTestFlow,
				testDataPredefined,
			}) => {
				const adminUserInfoAdmin = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				const regularUserId =
					regularUser.getAuthenticatedUser().user.userId;
				const adminUserId =
					adminUserInfoAdmin.getAuthenticatedUser().user.userId;

				const reloadRewardData = testDataPredefined.data.reloadReward;

				await gamdomDb.insertReloadReward(regularUserId, adminUserId);

				await changeReloadRewardTestFlow.changeReloadReward({
					adminUser: adminUserInfoAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					newRewardTotal: reloadRewardData.newTotalReward,
					newTotalAmount: reloadRewardData.newTotalAmount,
				});
			},
		);

		test(
			`[ENG-10269] Reload update - Skipped claims logic`,
			testDetails()
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				gamdomDb,
				testDataPredefined,
				claimReloadRewardTestFlow,
				verifyReloadRewardPresenceTestFlow,
			}) => {
				const adminUserInfoAdmin = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				const regularUserId =
					regularUser.getAuthenticatedUser().user.userId;
				const adminUserId =
					adminUserInfoAdmin.getAuthenticatedUser().user.userId;

				const reloadRewardData =
					testDataPredefined.data.reloadRewardWithUpdatedTotal;

				await gamdomDb.insertReloadReward(
					regularUserId,
					adminUserId,
					reloadRewardData.reloadCoins,
					reloadRewardData.expirationMs,
					reloadRewardData.claimIntervalMs,
					reloadRewardData.amountCoins,
					EvRewardTypes.RELOAD,
					RewardStatus.ACTIVE,
					reloadRewardData.daysOffset,
					reloadRewardData.daysToExpire,
					null,
					true,
					reloadRewardData.updatedNewTotal,
					reloadRewardData.modifiedDateDaysOffset,
				);

				await verifyReloadRewardPresenceTestFlow.verifyReloadRewardIsPresent(
					{
						adminUser: adminUserInfoAdmin,
						targetUsername:
							regularUser.getAuthenticatedUser().user.username,
						section: RewardStatus.ACTIVE,
					},
				);

				await claimReloadRewardTestFlow.claimReloadRewardAndVerifyBalance(
					{
						user: regularUser,
						rewardAmount: reloadRewardData.newReloadAmount,
						expectedBalanceIncrease:
							reloadRewardData.balanceIncrease,
					},
				);

				await verifyReloadRewardPresenceTestFlow.verifyReloadRewardIsAbsent(
					{
						adminUser: adminUserInfoAdmin,
						targetUsername:
							regularUser.getAuthenticatedUser().user.username,
						section: RewardStatus.ACTIVE,
					},
				);
			},
		);

		testData()
			.fromCsvParsed({
				file: CsvFilesName.RELOAD_UPDATE_AFTER_PARTIAL_CLAIM,
			})
			.forEach((input) => {
				test(
					`[ENG-10259] Reload update logic after partial claim - Admin: ${input.adminExpected} | Client: ${input.clientExpected}`,
					testDetails()
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.withTags(TestTag.ACCEPTANCE)
						.apply(),
					async ({
						browserSessionManager,
						gamdomDb,
						changeReloadRewardTestFlow,
						claimReloadRewardTestFlow,
						testDataPredefined,
					}) => {
						const adminUserInfoAdmin =
							await browserSessionManager.loginAs(
								TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
								{ reuseContext: true },
							);
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);

						const regularUserId =
							regularUser.getAuthenticatedUser().user.userId;
						const adminUserId =
							adminUserInfoAdmin.getAuthenticatedUser().user
								.userId;

						const reloadRewardData =
							testDataPredefined.data
								.reloadRewardWithUpdatedTotal;

						await gamdomDb.insertReloadReward(
							regularUserId,
							adminUserId,
							input.reloadCoins,
							reloadRewardData.expirationMs,
							reloadRewardData.claimIntervalMs,
							reloadRewardData.amountCoins,
							EvRewardTypes.RELOAD,
							RewardStatus.ACTIVE,
							0,
							input.days,
							null,
						);

						await claimReloadRewardTestFlow.claimReloadRewardAndVerifyBalance(
							{
								user: regularUser,
								rewardAmount: input.dailyRewardAmount,
								expectedBalanceIncrease: input.dailyReward,
								expectedRewardMissing: false,
							},
						);

						await gamdomDb.updateRewardsDates(
							regularUserId,
							input.updateRewardsDays,
						);
						await gamdomDb.updateClaimHistoryDates(
							regularUserId,
							input.updateRewardsDays,
						);

						await changeReloadRewardTestFlow.changeReloadReward({
							adminUser: adminUserInfoAdmin,
							targetUsername:
								regularUser.getAuthenticatedUser().user
									.username,
							newRewardTotal: input.totalRewards,
							newTotalAmount: input.totalRewardsAmount,
							shouldToastBePresent: input.shouldToastBePresent,
							shouldRewardBePresent: input.shouldRewardBePresent,
							expectedToastType: input.expectedToastType,
						});

						await regularUser.pages.rewardsPage.navigate();

						await regularUser.pages.rewardsPage
							.assertThat()
							.verifyRewardClaimability(
								CustomRewardType.RELOAD,
								input.shouldRewardBeClaimable,
								RewardButton.CLAIM,
								input.perClaimAmount,
							);
					},
				);
			});

		testData()
			.fromCsvParsed({
				file: CsvFilesName.RELOAD_UPDATE_LOGIC,
			})
			.forEach((input) => {
				test(
					`[ENG-10268] Reload update logic for: days: ${input.days} | dailyReward: ${input.dailyReward} | totalReward: ${input.totalReward}`,
					testDetails()
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.withTags(TestTag.ACCEPTANCE)
						.apply(),
					async ({
						browserSessionManager,
						gamdomDb,
						testDataPredefined,
						verifyReloadUpdateLogicTestFlow,
					}) => {
						const adminUserInfoAdmin =
							await browserSessionManager.loginAs(
								TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
								{ reuseContext: true },
							);
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);

						const regularUserId =
							regularUser.getAuthenticatedUser().user.userId;
						const adminUserId =
							adminUserInfoAdmin.getAuthenticatedUser().user
								.userId;

						const reloadRewardData =
							testDataPredefined.data
								.reloadRewardWithUpdatedTotal;

						await gamdomDb.insertReloadReward(
							regularUserId,
							adminUserId,
							input.reloadCoins,
							reloadRewardData.expirationMs,
							reloadRewardData.claimIntervalMs,
							reloadRewardData.amountCoins,
							EvRewardTypes.RELOAD,
							RewardStatus.ACTIVE,
							0,
							input.days,
							null,
							true,
							input.updateNewTotal,
						);

						await verifyReloadUpdateLogicTestFlow.verifyReloadUpdateLogic(
							{
								user: regularUser,
								adminUser: adminUserInfoAdmin,
								rewardAmount: input.perClaimExpectedAmount,
								expectedBalanceIncrease: input.perClaimExpected,
								expectedClaimedDays: input.expectedClaimedDays,
								totalDays: input.days,
							},
						);
					},
				);
			});
	},
);
