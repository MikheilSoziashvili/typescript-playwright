import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { test } from "@fixtures/fixtures";
import { HiloBetTestData } from "@dtos/test-data";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";

test.describe("Hilo tests", () => {
	test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username));
	test.slow();
	test("[ENG-298] Place a single bet on Hilo and try to win @smoke @originals", async ({
		hiloGamePage,
	}) => {
		const testData: HiloBetTestData = new HiloBetTestData(
			SUPER_ADMIN_CREDENTIALS.username,
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
			.playUntilResultColorIs(HiloGameResultColor.RED, testData);

		await hiloGamePage
			.assertThat()
			.gameResultColorIs(HiloGameResultColor.RED);

		const expectedProfit = hiloGamePage.calculateProfit(
			testData.betAmount,
			testData.betMultiplierByBetOption,
		);
		await hiloGamePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(accountBalance + expectedProfit);
	});
});
