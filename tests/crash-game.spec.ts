import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateUser1 } from "@fixtures/auth-fixtures";

test.describe("Crash tests", () => {
	test.use(storageStateUser1);
	test.slow();
	test("[ENG-265] Place a single bet on Crash and try to cashout @smoke", async ({
		crashGamePage,
	}) => {
		const betTestData: BetTestData = new BetTestData(
			"user1",
			10,
			Number("1.10"),
		);
		await crashGamePage.navigate();
		await crashGamePage.playUntilMultiplierIs(
			betTestData.autoCashoutMultiplier,
			betTestData,
		);
	});
});
