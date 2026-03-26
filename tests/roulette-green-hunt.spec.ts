import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Green hunt",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.ROULETTE)
		.apply(),
	() => {
		const rouletteDomainData = testData().fromDomain().roulette;

		rouletteDomainData.greenHuntScenarios.forEach((scenario) => {
			test(
				`[ENG-15292] Roulette - green hunt - ${scenario.when}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager, rouletteGamePage }) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});

					const { greenHuntValue, bet } =
						rouletteDomainData.buildGreenHuntBetData(
							browserSessionManager.activeUser.user.username,
						);

					await rouletteGamePage
						.steps()
						.navigateAndStartGreenHunt(
							greenHuntValue,
							scenario.when,
						);
					await rouletteGamePage
						.steps()
						.placeBetAndVerifyGreenHunt(
							bet,
							scenario.expectedGreenBet,
						);
				},
			);
		});
	},
);
