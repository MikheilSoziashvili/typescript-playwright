import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";

test.describe(
	"Wager Requirement",
	testDetails().withTags(JiraComponent.WAGER).apply(),
	() => {
		test(
			"[ENG-8762] Verify Wager Requirement modal presence and functionality",
			testDetails()
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(JiraComponent.WAGER)
				.apply(),
			async ({
				wagerRequirementTestFlow,
				testDataPredefined,
				browserSessionManager,
				gamdomApi,
				gamdomApiDbFacade,
			}) => {
				const wagerReq = testDataPredefined.data.wagerRequirement;
				const crashData = testDataPredefined.data.crash;

				const user =
					await wagerRequirementTestFlow.setupUserWithWagerRequirement({
						browserSessionManager: browserSessionManager,
						gamdomApi: gamdomApi,
						gamdomApiDbFacade: gamdomApiDbFacade,
						wagerReqEndCoins: wagerReq.wagerReqEndCoins,
					});

				await wagerRequirementTestFlow.verifyPopupPresenceAndDrag({
					user: user,
					message: wagerReq.message,
					targetAmountDollars: wagerReq.wagerReqEndDollars,
					dragTargetX: wagerReq.dragTargetX,
					dragTargetY: wagerReq.dragTargetY,
				});

				await wagerRequirementTestFlow.placeBetAndVerifyProgressUpdated({
					user: user,
					betAmount: wagerReq.smallBetAmount,
					autoCashOut: crashData.defaultAutoCashOutApi,
				});

				await wagerRequirementTestFlow.fulfillWagerRequirementAndVerifyPopupDisappears(
					{
						user: user,
						betAmount: wagerReq.largeBetAmount,
						autoCashOut: crashData.defaultAutoCashOutApi,
					},
				);
			},
		);
	},
);
