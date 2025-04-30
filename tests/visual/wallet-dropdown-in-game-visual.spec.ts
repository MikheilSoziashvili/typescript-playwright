import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Wallet dropdown - in game visual tests", () => {
	test.use(storageStateNewUserDB());
	test("[ENG-4421] Verify Wallet dropdown visually correct during Plinko game @originals @visual", async ({
		plinkoGamePage,
	}, testInfo) => {
		await plinkoGamePage.navigate();
		await plinkoGamePage.assertThat().dropBallButtonIsDisplayed();
		await plinkoGamePage.authenticatedHeader
			.assertThat()
			.walletAmountIsVisualDisplayed(testInfo);
	});
});
