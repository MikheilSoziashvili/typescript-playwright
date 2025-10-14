import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { KenoBetTestData } from "@dtos/test-data";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { KenoRiskValues } from "@enums/keno-risk-values";
import { test } from "@fixtures/fixtures";

test.describe(
	"Keno game tests",
	testDetails().withTags(JiraComponent.SOK_GAMES, JiraComponent.KENO).apply(),
	() => {
		const riskValues = [
			KenoRiskValues.CLASSIC,
			KenoRiskValues.LOW,
			KenoRiskValues.MEDIUM,
			KenoRiskValues.HIGH,
		];

		riskValues.forEach((riskValue) => {
			test(
				`[ENG-7136] Keno - Place a bet and try to win - Manual tile selection - Risk ${riskValue}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ kenoGamePage, gamdomApiDbFacade }) => {
					const kenoBetData = new KenoBetTestData({
						betAmount: 1,
						riskValue: riskValue,
					});

					const { cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth();
					await setAuthenticationCookies(kenoGamePage.page, cookie);

					await kenoGamePage.navigateAndWaitForGameToLoad();

					await kenoGamePage
						.steps()
						.playKenoUntilWin(kenoBetData.betAmount, {
							riskValue: kenoBetData.riskValue,
						});
				},
			);
		});

		riskValues.forEach((riskValue) => {
			test(
				`[ENG-7136] Keno - Place a bet and try to win - Auto tile selection - Risk ${riskValue}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ kenoGamePage, gamdomApiDbFacade }) => {
					const kenoBetData = new KenoBetTestData({
						betAmount: 1,
						riskValue: riskValue,
					});

					const { cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth();
					await setAuthenticationCookies(kenoGamePage.page, cookie);

					await kenoGamePage.navigateAndWaitForGameToLoad();

					await kenoGamePage
						.steps()
						.playKenoUntilWin(kenoBetData.betAmount, {
							riskValue: kenoBetData.riskValue,
							useAutoTileSelection: true,
						});
				},
			);
		});
	},
);
