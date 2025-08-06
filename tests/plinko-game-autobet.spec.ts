import { Timeout } from "@enums/timeout";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe(
	"Plinko autobet tests",
	{ tag: ["@originals", "@plinko", "@sok-games"] },
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

		test(`[ENG-5051] Plinko - Autobet - Players choice`, async ({
			plinkoGamePage,
		}) => {
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
			await plinkoGamePage.assertThat().starAutobetButtonIsDisplayed();
			await plinkoGamePage
				.assertThat()
				.numberOfBetsInputAndRemainingBetsLabelAreEqual();
		});

		test(`[ENG-5048] Plinko - Autobet - Start-Stop`, async ({
			plinkoGamePage,
		}) => {
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
		});

		test(`[ENG-5789] Plinko - Autobet - Verify balance update`, async ({
			plinkoGamePage,
			userBalanceHandler,
		}) => {
			const initialAccountBalance =
				await userBalanceHandler.walletBalanceInUsd();
			const initialYourBetBalance =
				await plinkoGamePage.getYourBetValue();

			await plinkoGamePage.steps().startAutobetSuccessfully();

			await plinkoGamePage
				.assertThat()
				.balanceAndYourBetUpdatedSimultaneosly(
					initialAccountBalance,
					initialYourBetBalance,
				);
		});
	},
);
