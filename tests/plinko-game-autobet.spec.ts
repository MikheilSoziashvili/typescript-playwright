import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { OriginalGame } from "@enums/original-games";
import { Timeout } from "@enums/timeout";
import { Unit } from "@enums/units";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Plinko autobet tests",
	testDetails()
		.withTags(JiraComponent.PLINKO, JiraComponent.SOK_GAMES)
		.apply(),
	() => {
		test.use(storageStateNewUserDB());
		test.slow();

		const numberOfAutoBets = "50";

		test.beforeEach(async ({ plinkoGamePage }) => {
			await plinkoGamePage.navigate();
			await plinkoGamePage.assertThat().dropBallButtonIsDisplayed();
			await plinkoGamePage.steps().navigateToAutobetSuccessfully();
			await plinkoGamePage.assertThat().leftBetPanelIsDisplayed();
			await plinkoGamePage.steps().enterNumberOfBets(numberOfAutoBets);
		});

		test(
			`[ENG-5051] Plinko - Autobet - Players choice`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ plinkoGamePage }) => {
				await plinkoGamePage
					.assertThat()
					.numberOfBetsInputAndRemainingBetsLabelAreEqual();
				await plinkoGamePage.steps().startAutobetSuccessfully();
				await plinkoGamePage
					.steps()
					.verifyRemainingBetsDecreasing(numberOfAutoBets);
				await plinkoGamePage
					.assertThat()
					.autobetFinishInGameToastIsDisplayed();
				await plinkoGamePage
					.assertThat()
					.starAutobetButtonIsDisplayed();
				await plinkoGamePage
					.assertThat()
					.numberOfBetsInputAndRemainingBetsLabelAreEqual();
			},
		);

		test(
			`[ENG-5048] Plinko - Autobet - Start-Stop`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ plinkoGamePage }) => {
				await plinkoGamePage.steps().startAutobetSuccessfully();
				await plinkoGamePage
					.assertThat()
					.verifyRowsAndRiskSlidersInactive();
				await plinkoGamePage.steps().stopAutobetSuccessfully();
				const initialAccountBalance =
					await plinkoGamePage.authenticatedHeader.getAccountBalance();
				await plinkoGamePage
					.assertThat()
					.autobetFinishInGameToastIsDisplayed();
				await plinkoGamePage
					.assertThat()
					.verifyRowsAndRiskSlidersActive(Timeout.LONG);
				await plinkoGamePage.authenticatedHeader
					.assertThat()
					.accountBalanceHasChanged(initialAccountBalance);
			},
		);

		test(
			`[ENG-5789] Plinko - Autobet - Verify balance update`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ plinkoGamePage, userBalanceHandler, originalsPage }) => {
				const initialAccountBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();
				const initialYourBetBalance =
					await plinkoGamePage.getYourBetValue();

				await plinkoGamePage.steps().startAutobetSuccessfully();

				await originalsPage
					.assertThat()
					.balanceAndYourBetUpdatedSimultaneously(
						Unit.COINS,
						initialAccountBalance,
						initialYourBetBalance,
						OriginalGame.Plinko,
					);
			},
		);

		test(
			`[ENG-5187] [Plinko] Cannonballs fall in the correct cannons`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				plinkoGamePage,
				errorConsoleAsserter,
				testDataPredefined,
			}) => {
				const betsNumber =
					testDataPredefined.data.betsNumberPlinkoCannon.numberOfBets;
				await plinkoGamePage.steps().enterNumberOfBets(betsNumber);
				await plinkoGamePage.steps().startAutobetSuccessfully();
				await plinkoGamePage.waitUntilAutobetIsFinished(betsNumber);
				errorConsoleAsserter.assertNoMissingBallErrorPresent();
			},
		);
	},
);
