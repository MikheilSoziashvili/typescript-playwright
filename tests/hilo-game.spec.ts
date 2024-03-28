import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "../enums/hilo-result-messages";
import { test } from "../fixtures/fixtures";
import { HiloBetTestData } from "../dtos/test-data";
import { HiloBetMultiplierByBetOption } from "../enums/original-games";
import { HiloBetOption } from "../enums/hilo-bet-options";
import { storageStateSuperadmin } from "../fixtures/auth-fixtures";

test.describe("Hilo tests", () => {
	test.use(storageStateSuperadmin);
	test("[QA-129] Place a single bet on Hilo and try to win @smoke", async ({
		homePage,
		hiloGamePage,
	}) => {
		const testData: HiloBetTestData = new HiloBetTestData(
			"user1",
			100,
			HiloBetOption.RED,
			HiloBetMultiplierByBetOption.RED,
		);

		await hiloGamePage.navigate();
		await hiloGamePage
			.assertThat()
			.gameMessageIs(HiloGameStatusMessage.SPINNING_IN);

		const accountBalance = await hiloGamePage
			.steps()
			.playUntilResultColorIs(
				HiloGameResultColor.RED,
				testData,
				homePage,
			);

		await hiloGamePage
			.assertThat()
			.gameResultColorIs(HiloGameResultColor.RED);

		const expectedProfit = hiloGamePage.calculateProfit(
			testData.betAmount,
			testData.betMultiplierByBetOption,
		);
		await homePage
			.assertThat()
			.accountBalanceIs(accountBalance + expectedProfit);
	});
});
