import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Wallet dropdown - in game visual tests", () => {
	test.use(storageStateNewUserAPI());
	test("[ENG-4421] Verify Wallet dropdown visually correct during Plinko game @originals @visual", async ({
		plinkoGamePage,
		homePage,
	}, testInfo) => {
		await plinkoGamePage.navigate();
		await plinkoGamePage.assertThat().dropBallButtonIsDisplayed();
		await plinkoGamePage.authenticatedHeader
			.assertThat()
			.playingStringIsVisualDisplayed(testInfo);
		await plinkoGamePage.authenticatedHeader.hoverOnWalletDropdown();
		await plinkoGamePage.authenticatedHeader
			.assertThat()
			.walletAmountIsVisualDisplayed(testInfo);
		await homePage.hoverOnWalletButton();
		await plinkoGamePage.authenticatedHeader
			.assertThat()
			.playingStringIsVisualDisplayed(testInfo);
	});
});
