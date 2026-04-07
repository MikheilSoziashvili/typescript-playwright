import { buildRewardsRoyaltyUpRankSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { TestUserRole } from "@enums/test-user-roles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

test.describe("Royalty up rewards tests", () => {
	// TODO: Add additional test data for different games and bet types when rewards calculation is defined.
	const rewardsInputData = [
		{
			tipUserAmount: SUPER_HIGH_USER_AMOUNT,
			game: OriginalGame.Dice,
			betAmount: 200000,
			betType: 1.1,
			expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
			expectedClaimableRanks: [
				RewardsRoyaltyUpRanks.BRONZE_3,
				RewardsRoyaltyUpRanks.SILVER_1,
				RewardsRoyaltyUpRanks.SILVER_2,
				RewardsRoyaltyUpRanks.SILVER_3,
				RewardsRoyaltyUpRanks.GOLD_1,
			],
			expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
		},
		{
			tipUserAmount: SUPER_HIGH_USER_AMOUNT,
			game: OriginalGame.Crash,
			betAmount: 50000,
			betType: 1.1,
			expectedRankToast: RewardsRoyaltyUpRanks.SILVER_3,
			expectedClaimableRanks: [
				RewardsRoyaltyUpRanks.BRONZE_3,
				RewardsRoyaltyUpRanks.SILVER_1,
				RewardsRoyaltyUpRanks.SILVER_2,
				RewardsRoyaltyUpRanks.SILVER_3,
			],
			expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_1,
		},
		{
			tipUserAmount: SUPER_HIGH_USER_AMOUNT,
			game: OriginalGame.Roulette,
			betAmount: 70000,
			betType: RouletteBetColor.BLACK,
			expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
			expectedClaimableRanks: [
				RewardsRoyaltyUpRanks.BRONZE_3,
				RewardsRoyaltyUpRanks.SILVER_1,
				RewardsRoyaltyUpRanks.SILVER_2,
				RewardsRoyaltyUpRanks.SILVER_3,
				RewardsRoyaltyUpRanks.GOLD_1,
			],
			expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
		},
		{
			tipUserAmount: SUPER_HIGH_USER_AMOUNT,
			game: OriginalGame.HiLo,
			betAmount: 70000,
			betType: HiloBetOption.BLACK,
			expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
			expectedClaimableRanks: [
				RewardsRoyaltyUpRanks.BRONZE_3,
				RewardsRoyaltyUpRanks.SILVER_1,
				RewardsRoyaltyUpRanks.SILVER_2,
				RewardsRoyaltyUpRanks.SILVER_3,
				RewardsRoyaltyUpRanks.GOLD_1,
			],
			expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
		},
	];

	rewardsInputData.forEach((inputData) => {
		test.describe("Gain royalty up rank tests", () => {
			test.use(
				storageStateNewUserDB({
					amount: inputData.tipUserAmount,
					emailVerified: true,
				}),
			);

			test(
				`[ENG-3712] Verify in-progress rank gain for '${inputData.game}' Originals game with '${inputData.betAmount}' bet, expected rank '${inputData.expectedInProgressRanks}', and claim all Royalty-Up rewards`,
				testDetails()
					.withAuthor(JiraUser.ANGEL_PETROV)
					.withTags(TestTag.ACCEPTANCE)
					.apply(),
				async ({ rewardsPage, toast, originalsPage }) => {
					test.fixme(
						true,
						"Temporary skipped until test cases are adjusted to use casino games, then the automation code will be adjusted to align",
					);
					test.slow();

					await originalsPage.navigateToGame(inputData.game);
					await originalsPage.placeBet(
						inputData.game,
						inputData.betAmount,
						inputData.betType,
					);

					await toast.assertThat().isDisplayed();
					await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
						subTitle: buildRewardsRoyaltyUpRankSubTitle(
							inputData.expectedRankToast,
						),
					});

					await originalsPage.waitForGameRoundFinish(inputData.game);

					await rewardsPage.navigate();
					await rewardsPage
						.assertThat()
						.isRoyaltyUpRewardsClaimable(
							inputData.expectedClaimableRanks,
						);

					await rewardsPage.claimRoyaltyUpReward(
						inputData.expectedClaimableRanks,
					);

					await rewardsPage
						.assertThat()
						.isRoyaltyUpRewardsInProgress(
							inputData.expectedInProgressRanks,
						);
				},
			);
		});
	});

	test.describe("Claim royalty up rank tests", () => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.ROYALTY_UP_LEVEL_RANKS,
			})
			.forEach((record) => {
				test(
					`[ENG-10465] Royalty up level ranks - claim '${record.currentLevel}' rank and verify '${record.newLevel}' rank in progress`,
					testDetails()
						.withTags(
							JiraComponent.ROYALTY_UP,
							JiraComponent.REWARDS,
							TestTag.ACCEPTANCE,
						)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({
						browserSessionManager,
						gamdomApiDbFacade,
						page,
						rewardsPage,
						toast,
						originalsPage,
						testDataObject,
					}) => {
						const { cookie, user } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth({
								emailVerified: true,
								startingXp: record.userBeXp - 1,
							});
						await setAuthenticationCookies(page, cookie);

						const betTestData = testDataObject.bet.build(
							{ username: user.username },
							{ betAmount: 1000, autoCashoutMultiplier: 2 },
						);

						await originalsPage.navigateAndPlaceBet(
							OriginalGame.Dice,
							betTestData.betAmount,
							betTestData.autoCashoutMultiplier,
						);

						await toast.assertThat().isDisplayed();
						await toast
							.assertThat()
							.titleIs(ToastTitle.CONGRATULATIONS, {
								subTitle: buildRewardsRoyaltyUpRankSubTitle(
									record.currentLevel,
								),
							});

						await originalsPage.waitForGameRoundFinish(
							OriginalGame.Dice,
						);
						await rewardsPage.navigate();
						await rewardsPage
							.assertThat()
							.isRoyaltyUpRewardsClaimable([record.currentLevel]);

						await rewardsPage.claimRoyaltyUpReward([
							record.currentLevel,
						]);

						await rewardsPage
							.assertThat()
							.isRoyaltyUpRewardsInProgress(record.newLevel);

						const superAdminSession =
							await browserSessionManager.loginAs(
								TestUserRole.SUPERADMIN,
							);
						await superAdminSession.pages.userInfoAdminPage.navigate();
						await superAdminSession.pages.userInfoAdminPage
							.steps()
							.showUserDetails(user.username);
						await superAdminSession.pages.infoAdminPage
							.assertThat()
							.userXpAboveExpectedRoyaltyUpRankXpValue(
								record.rankXp,
							);
					},
				);
			});

		test(
			`[ENG-10465] Royalty up level ranks - claim 'Bronze 1' rank with unranked amount from previous 'Unranked' rank`,
			testDetails()
				.withTags(JiraComponent.ROYALTY_UP, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({
				browserSessionManager,
				gamdomApiDbFacade,
				page,
				rewardsPage,
				toast,
				originalsPage,
				testDataObject,
			}) => {
				const unrankedToBronze1 =
					testDataObject.royaltyUpLevelRanks.preconfigured()
						.unrankedToBronze1;

				const { cookie, user } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						emailVerified: true,
						startingXp: unrankedToBronze1.userBeXp - 1,
					});
				await setAuthenticationCookies(page, cookie);

				const betTestData = testDataObject.bet.build(
					{ username: user.username },
					{ betAmount: 1000, autoCashoutMultiplier: 2 },
				);

				await originalsPage.navigateAndPlaceBet(
					OriginalGame.Dice,
					betTestData.betAmount,
					betTestData.autoCashoutMultiplier,
				);

				await toast.assertThat().isDisplayed();
				await toast.assertThat().titleIs(ToastTitle.CONGRATULATIONS, {
					subTitle: ToastSubTitle.ROYALTY_UP_STARTED,
				});

				await originalsPage.waitForGameRoundFinish(OriginalGame.Dice);

				await originalsPage.placeBet(
					OriginalGame.Dice,
					betTestData.betAmount * 2,
					betTestData.autoCashoutMultiplier,
				);

				await toast.assertThat().isDisplayed();
				await toast.assertThat().titleIs(ToastTitle.CONGRATULATIONS, {
					subTitle: buildRewardsRoyaltyUpRankSubTitle(
						unrankedToBronze1.newLevel,
					),
				});

				await rewardsPage.navigate();
				await rewardsPage
					.assertThat()
					.isRoyaltyUpRewardsClaimable([unrankedToBronze1.newLevel]);

				await rewardsPage.claimRoyaltyUpReward(
					[unrankedToBronze1.newLevel],
					{
						includePreviousRankReward: true,
						previousRank: RewardsRoyaltyUpRanks.UNRANKED,
					},
				);

				const superAdminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
				);
				await superAdminSession.pages.userInfoAdminPage.navigate();
				await superAdminSession.pages.userInfoAdminPage
					.steps()
					.showUserDetails(user.username);
				await superAdminSession.pages.infoAdminPage
					.assertThat()
					.userXpAboveExpectedRoyaltyUpRankXpValue(
						unrankedToBronze1.rankXp,
					);
			},
		);
	});

	test.describe("Royalty up skipping levels tests", () => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.ROYALTY_UP_SKIPPING_LEVELS,
			})
			.forEach((record) => {
				test(
					`[ENG-10845] Royalty up skipping levels - upgrade from '${record.currentLevel}' to '${record.newLevel}' and verify claimable/unclaimable rewards`,
					testDetails()
						.withTags(
							JiraComponent.ROYALTY_UP,
							JiraComponent.REWARDS,
							TestTag.ACCEPTANCE,
						)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({
						gamdomApiDbFacade,
						page,
						gamdomDb,
						rewardsPage,
						originalsPage,
						testDataObject,
					}) => {
						const { cookie, user } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth({
								emailVerified: true,
								startingXp: record.userBeXp - 1,
							});
						await setAuthenticationCookies(page, cookie);
						await gamdomDb.insertMultipleRoyaltyUpRewards(
							user.userId,
							record.ranksRewards,
						);
						const betTestData = testDataObject.bet.build(
							{ username: user.username },
							{ betAmount: 1000, autoCashoutMultiplier: 2 },
						);
						await originalsPage.navigateAndPlaceBet(
							OriginalGame.Dice,
							betTestData.betAmount,
							betTestData.autoCashoutMultiplier,
						);
						await rewardsPage.navigate();
						await rewardsPage
							.assertThat()
							.verifyRoyaltyUpRewardsClaimableState(
								record.claimableRewards,
								true,
							);

						await rewardsPage
							.assertThat()
							.verifyRoyaltyUpRewardsClaimableState(
								record.unclaimableRewards,
								false,
							);
						await rewardsPage
							.steps()
							.claimClaimableRoyaltyUpRewards(
								record.claimableRewards,
							);
					},
				);
			});
	});
});
