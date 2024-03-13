import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "../enums/hilo-result-messages";
import { test } from "../fixtures/fixtures";
import { logger } from "../logger/logger";
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

		let isWin = false;
		let accountBalance = await homePage.getAccountBalance();

		while (!isWin) {
			await hiloGamePage.fillInBetAmount(testData.betAmount);
			await hiloGamePage.placeBet(testData.betOption);
			await hiloGamePage
				.assertThat()
				.gameMessageIs(HiloGameStatusMessage.DRAWING);
			accountBalance = await homePage.getAccountBalance();

			const roundresult = await hiloGamePage.getRoundResult();
			isWin = roundresult.includes(HiloGameResultColor.RED);

			if (!isWin) {
				logger.info("Hilo game lost! Trying again...");
			}
		}

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
