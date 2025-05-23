import { BrowserName } from "@enums/playwright/project-browser-names";
import { Timeout } from "@enums/timeout";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { jiraIssueId } from "@core/utils/utils";

test.describe("Plinko autobet tests", () => {
	test.use(storageStateNewUserDB());
	test.slow();
	const numberOfAutoBets = "50";

	test.beforeEach(async ({ plinkoGamePage }, testInfo) => {
		if (testInfo.project.name === BrowserName.FIREFOX) {
			testInfo.annotations.push({
				type: "performance",
				description: jiraIssueId(6628),
			});
		}
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
		await plinkoGamePage.assertThat().autobetFinishInGameToastIsDisplayed();
		await plinkoGamePage.assertThat().starAutobetButtonIsDisplayed();
		await plinkoGamePage
			.assertThat()
			.numberOfBetsInputAndRemainingBetsLabelAreEqual();
	});

	test(`[ENG-5048] Plinko - Autobet - Start-Stop`, async ({
		plinkoGamePage,
	}) => {
		await plinkoGamePage.steps().startAutobetSuccessfully();
		await plinkoGamePage.assertThat().verifyRowsAndRiskSlidersInactive();
		await plinkoGamePage.steps().stopAutobetSuccessfully();
		const initialAccountBalance =
			await plinkoGamePage.authenticatedHeader.getAccountBalance();
		await plinkoGamePage.assertThat().autobetFinishInGameToastIsDisplayed();
		await plinkoGamePage
			.assertThat()
			.verifyRowsAndRiskSlidersActive(Timeout.LONG);
		await plinkoGamePage.authenticatedHeader
			.assertThat()
			.accountBalanceHasChanged(initialAccountBalance);
	});
});
