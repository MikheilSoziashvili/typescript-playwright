import { ALL_USER_TYPES_ENABLED } from "@constants/feature-configurations";
import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"[KOTH] Points calculation formula",
	testDetails().withTags(JiraComponent.KOTH, TestTag.SEQUENTIAL).apply(),
	() => {
		test.describe.configure({ mode: "serial" });

		test.beforeEach(async ({ browserSessionManager }) => {
			const superAdmin = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
				{ reuseContext: true },
			);

			await (
				await superAdmin.apis.gamdomApi
			).setFeatureState(
				Feature.ZERO_EDGE_RTP_ORIGINALS,
				ALL_USER_TYPES_ENABLED,
			);
		});

		testData()
			.fromCsvRaw({ file: CsvFilesName.KOTH_POINTS_CALCULATION })
			.forEach(({ kothType, game, betAmount }) => {
				test(
					`[ENG-9786] [KOTH] Verify KoTH points calculation formula - zero edge enabled for ${kothType} and ${game}`,
					testDetails()
						.withTags(TestTag.ACCEPTANCE)
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({ kothPointsCalculationTestFlow }) => {
						test.slow();

						const {
							user,
							kothEndpoint,
							initialPoints,
							dynamicHouseEdge,
						} =
							await kothPointsCalculationTestFlow.prepareUserAndGetKothInitialPoints(
								{ kothType, game },
							);

						const { expectedPoints } =
							await kothPointsCalculationTestFlow.placeBetAndCalculatePoints(
								{
									user: user,
									game: game,
									betAmountInCoins: Number(betAmount),
									dynamicHouseEdge: dynamicHouseEdge,
								},
							);

						await kothPointsCalculationTestFlow.verifyKothPointsIncreased(
							{
								user,
								kothEndpoint,
								initialPoints,
								expectedPoints,
							},
						);
					},
				);
			});
	},
);
