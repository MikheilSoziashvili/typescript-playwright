import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { test } from "@fixtures/fixtures";
import { HiloBetTestData, RegisterTestData } from "@dtos/test-data";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";

const userCredentials = new RegisterTestData();
test.describe("Hilo tests", () => {
	test.use(storageStateNewUserAPI({ username: userCredentials.username }));
	test.slow();
	test("[ENG-298] Place a single bet on Hilo and try to win @smoke @originals", async ({
		hiloGamePage,
	}) => {
		const testData: HiloBetTestData = new HiloBetTestData(
			userCredentials.username,
			10,
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
