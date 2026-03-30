import { test } from "@fixtures/fixtures";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Green hunt",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.ROULETTE)
		.apply(),
	() => {
		test(
			"[ENG-1090] Roulette - green hunt",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				browserSessionManager,
				rouletteGamePage,
				testDataObject,
				testDataPredefined,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});
				const { betAmount, betColor, percentage } =
					testDataPredefined.data.roulette.greenHunt;
				const testData = testDataObject.rouletteBet.build(
					{
						username:
							browserSessionManager.activeUser.user.username,
					},
					{ betAmount, betColor },
				);

				await rouletteGamePage
					.steps()
					.navigateAndStartGreenHunt(
						percentage,
						GreenHuntTypeOption.PERCENT,
					);
				const rouletteResultNumber = await rouletteGamePage
					.steps()
					.placeBetAndVerifyGreenHunt(testData, percentage);
				await rouletteGamePage
					.assertThat()
					.previousRollsHistoryUpdated(rouletteResultNumber);
			},
		);
	},
);
