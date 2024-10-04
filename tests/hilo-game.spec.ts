import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { test } from "@fixtures/fixtures";
import { HiloBetTestData } from "@dtos/test-data";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle } from "@core/utils/utils";

test.describe("Hilo tests", () => {
	test.use(storageStateNewUserAPI());
	test.slow();
	test("[ENG-298] Place a single bet on Hilo and try to win @smoke @originals", async ({
		hiloGamePage,
	},testInfo) => {
		const newUserDetails = getUserDetailsByTestTitle(
			testInfo.title,
			testInfo.workerIndex,
		);
		const testData: HiloBetTestData = new HiloBetTestData(
			newUserDetails.username,
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
