import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { predefined } from "test-data/sources/predefined";
import { testData } from "test-data/test-data-manager";

test.describe("Instant reward with rakeback verification tests", () => {
	test.beforeEach(async ({ browserSessionManager }) => {
		const superAdmin = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);

		await (
			await superAdmin.apis.gamdomApi
		).changeRankRewardConfigs({
			globalValues: {
				instantRakebackPercentage:
					predefined.originalGames.rakebackPercentage,
			},
		});
	});

	testData()
		.fromCsvParsed({
			file: CsvFilesName.INSTANT_REWARDS_ROYALTY_UP_LEVELS,
		})
		.forEach((record) => {
			test(
				`[ENG-10283] Rakeback - Instant rewards with Zero edge disabled | rank: ${record.level} | game: ${record.game}`,
				testDetails()
					.withTags(JiraComponent.REWARDS)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({
					browserSessionManager,
					instantRakebackRewardTestFlow,
				}) => {
					const { game, houseEdge, userBeXp } = record;
					const user = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
						{
							reuseContext: true,
							regularUserOptions: {
								emailVerified: true,
								startingXp: userBeXp,
							},
						},
					);

					await instantRakebackRewardTestFlow.placeBetAndVerifyRakeback(
						{
							user,
							game,
							houseEdge,
						},
					);
				},
			);
		});

	testData()
		.fromCsvParsed({
			file: CsvFilesName.CASINO_GAME_INSTANT_REWARDS_ROYALTY_UP_LEVELS,
		})
		.forEach((record) => {
			test(
				`[ENG-10283] Rakeback - Instant rewards with Zero edge disabled for casino game ${record.game} | rank: ${record.level} | game: ${record.game}`,
				testDetails()
					.withTags(JiraComponent.REWARDS)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({
					casinoGameHouseEdgeTestFlow,
					casinoGameRakebackTestFlow,
				}) => {
					const houseEdge =
						await casinoGameHouseEdgeTestFlow.getHouseEdge({
							casinoGameName: record.game,
							providerCode: record.providerCode,
						});

					await casinoGameRakebackTestFlow.playCasinoGameAndVerifyRakeback(
						{
							gameName: record.game,
							gameProvider: record.gameProvider,
							userBeXp: record.userBeXp,
							houseEdge: houseEdge,
							betCount: predefined.casinoGames.betCount,
						},
					);
				},
			);
		});
});
