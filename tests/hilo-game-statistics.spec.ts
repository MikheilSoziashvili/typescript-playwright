import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { HiloGameStatusMessage } from "@enums/hilo-result-messages";
import { JiraUser } from "@enums/jira/jira-users";
import { OriginalGame } from "@enums/original-games";
import { TestTag } from "@enums/test-tags";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { isScheduledRun } from "configuration";

const lastRoundsInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.HILO_LAST_ROUNDS_STATISTICS,
) as {
	lastRounds: number;
}[];

test.describe(
	"Hilo game - statistics tests",
	testDetails().withTags(TestTag.ORIGINALS).apply(),
	() => {
		test.use(storageStateNewUserDB());
		test.slow();

		test.fixme(isScheduledRun);
		lastRoundsInputs.forEach((input) => {
			test(
				`[ENG-2138] Verify last '${input.lastRounds}' rounds Red/Black percentage history statistics`,
				testDetails()
					.withJiraBugTickets("4718")
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({ hiloGamePage, originalsPage }) => {
					await hiloGamePage.navigate();
					await originalsPage.waitForGameRoundFinish(
						OriginalGame.HiLo,
					);
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
				},
			);
		});
	},
);
