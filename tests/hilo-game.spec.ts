import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { test } from "@fixtures/fixtures";
import { HiloBetTestData } from "@dtos/test-data";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle } from "@core/utils/utils";
import { TestTag } from "@enums/test-tags";
import { testDetails } from "@core/helpers/test-details-helper";

test.describe(
	"Hilo tests",
	testDetails().withTags(TestTag.SMOKE, TestTag.ORIGINALS).apply(),
	() => {
		test.use(storageStateNewUserDB());
		test.slow();
		test("[ENG-298] Place a single bet on Hilo and try to win", async ({
			hiloGamePage,
		}, testInfo) => {
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
	},
);
