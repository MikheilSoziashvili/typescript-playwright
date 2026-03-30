import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { PocketDiceSliderValues } from "@enums/pocket-dice-enums";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Pocket Dice game tests",
	testDetails().withTags(JiraComponent.SOK_GAMES).apply(),
	() => {
		const sokGamesDomain = testData().fromDomain().sokGames;
		const scenarios = sokGamesDomain.autobetIncreaseByScenarios;

		sokGamesDomain.pocketDiceRollTypes.forEach((rollType) => {
			scenarios.forEach(({ betAmount, onWin, onLoss }) => {
				test(
					`[ENG-6143] Pocket Dice - Autobet Increase By - Roll ${rollType} - Bet ${betAmount} - On win ${onWin}% On loss ${onLoss}%`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ pocketDicePage, browserSessionManager }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{
								reuseContext: true,
							},
						);
						await pocketDicePage
							.steps()
							.navigateAndWaitForGameToLoad();
						await pocketDicePage.configureAutobetIncreaseBy(
							betAmount,
							PocketDiceSliderValues.SIX,
							rollType,
							sokGamesDomain.autobetCount,
							onWin,
							onLoss,
						);
						await pocketDicePage
							.steps()
							.playAutobetUntilWinAndLoss(
								betAmount,
								onWin,
								onLoss,
							);
					},
				);
			});
		});
	},
);
