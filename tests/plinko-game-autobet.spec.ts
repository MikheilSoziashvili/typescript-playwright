import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";

test.describe("Plinko autobet tests", () => {
	test.use(storageStateNewUserAPI());
	test.slow();
	test(`[ENG-5051] Plinko - Autobet - Players choice`, async ({
		plinkoGamePage,
	}) => {
		const numberOfAutoBets = "50";
		await plinkoGamePage.navigate();
		await plinkoGamePage.assertThat().dropBallButtonIsDisplayed();
		await plinkoGamePage.steps().navigateToAutobetSuccessfully();
		await plinkoGamePage.assertThat().leftBetPanelIsDisplayed();
		await plinkoGamePage.steps().enterNumberOfBets(numberOfAutoBets);
		await plinkoGamePage
			.assertThat()
			.numberOfBetsInputAndRemainingBetsLabelAreEqual();
		await plinkoGamePage.steps().startAutobetSuccessfully();
		await plinkoGamePage
			.steps()
			.verifyRemainingBetsDecreasing(numberOfAutoBets);
		await plinkoGamePage.assertThat().autobetFinishInGameToastIsDisplayed();
		await plinkoGamePage.assertThat().starAutobetButtonIsDisplayed();
		await plinkoGamePage
			.assertThat()
			.numberOfBetsInputAndRemainingBetsLabelAreEqual();
	});
});
