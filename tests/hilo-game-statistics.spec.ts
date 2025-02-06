import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { HiloGameStatusMessage } from "@enums/hilo-result-messages";
import { OriginalGame } from "@enums/original-games";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const lastRoundsInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.HILO_LAST_ROUNDS_STATISTICS,
) as {
	lastRounds: number;
}[];

test.describe("Hilo game - statistics tests", () => {
	test.use(storageStateNewUserAPI());
	test.slow();

	lastRoundsInputs.forEach((input) => {
		test(`[ENG-2138] Verify last '${input.lastRounds}' rounds Red/Black percentage history statistics @originals`, async ({
			hiloGamePage,
			originalsPage,
		}) => {
			test.fixme(
				true,
				"Issue [ENG-4718] The Stats calculation for Last x rounds is wrong",
			);
			await hiloGamePage.navigate();
			await originalsPage.waitForGameRoundFinish(OriginalGame.HiLo);
			await hiloGamePage
				.assertThat()
				.gameMessageIs(HiloGameStatusMessage.SPINNING_IN);

			await hiloGamePage.steps().openHistoryModalSuccessfully();

			const hiloCardsColorDataHistoryModal = await hiloGamePage
				.steps()
				.getHistoryModalCardsPercentageValue(input.lastRounds);

			await hiloGamePage.steps().closeHistoryModalSuccessfully();
			await hiloGamePage
				.steps()
				.selectLastRoundsDropdownValues(input.lastRounds);
			const hiloCardsColorDataStatsArea = await hiloGamePage
				.steps()
				.getStatsAreaCardsProbabilityPercentageValue();

			await hiloGamePage
				.assertThat()
				.cardColorPercentageValuesEqual(
					hiloCardsColorDataHistoryModal.blackCards,
					hiloCardsColorDataStatsArea.blackCards,
				);
			await hiloGamePage
				.assertThat()
				.cardColorPercentageValuesEqual(
					hiloCardsColorDataHistoryModal.redCards,
					hiloCardsColorDataStatsArea.redCards,
				);
		});
	});
});
