import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceAutobetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "../enums/csv-file-name";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";

test.describe(
	"Dice game autobet",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.DICE)
		.apply(),
	() => {
		test.use(storageStateNewUserDB());

		for (const betData of parse_csv(
			DATASETS_DIR,
			CsvFilesName.DICE_AUTOBET,
		) as {
			betAmount: number;
			rollOver: number;
			numberOfBets: number;
			stopOnProfit: number;
			stopOnLoss: number;
		}[]) {
			test(
				`"[ENG-1415] Dice - autobet with roll over ${betData.rollOver}"`,
				testDetails()
					.withTags(
						JiraComponent.GAMDOM_ORIGINALS,
						JiraComponent.DICE,
					)
					.withAuthor(JiraUser.NIKOLAY_GENOV)
					.apply(),
				async ({ diceGamePage }) => {
					await diceGamePage.navigate();
					await diceGamePage
						.assertThat()
						.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

					const diceBetData = new DiceAutobetTestData(betData);
					const initialBalance =
						await diceGamePage.authenticatedHeader.getAccountBalance();

					await diceGamePage.steps().startAutobet(diceBetData);

					await diceGamePage
						.assertThat()
						.balanceAfterAutoBetIsCorrect(
							initialBalance,
							diceBetData,
						);
				},
			);
		}

		const increaseByDataset = parse_csv(
			DATASETS_DIR,
			CsvFilesName.DICE_AUTOBET_INCREASE_BY,
		) as {
			input: BetIncreaseCondition;
			roll_over: number;
		}[];

		const diceGameResultEnumMap: Record<string, DiceGameResultMessage> = {
			win: DiceGameResultMessage.WIN,
			loss: DiceGameResultMessage.LOOSE,
			both:
				Math.random() < 0.5
					? DiceGameResultMessage.WIN
					: DiceGameResultMessage.LOOSE,
		};

		increaseByDataset.forEach((record) => {
			test(
				`[ENG-2843] Dice - Autobet - Increase by on condition ${record.input}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({ diceGamePage }) => {
					const increaseByTestData = new DiceAutobetTestData({
						betAmount: 10,
						numberOfBets: 2,
						rollOver: record.roll_over,
					});

					const gameResultEnum = diceGameResultEnumMap[record.input];

					await diceGamePage.navigate();
					await diceGamePage
						.steps()
						.autobetIncreaseBy(
							gameResultEnum,
							increaseByTestData,
							record.input,
							50,
						);
					await diceGamePage.steps().openHistoryAndAssertLastBet(15);
				},
			);
		});

		test(
			`"[ENG-5847] Dice - Stop Autobet actuates immediately"`,
			testDetails()
				.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.DICE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ diceGamePage, userBalanceHandler }) => {
				const autobetData = new DiceAutobetTestData({
					betAmount: 1,
					numberOfBets: 0,
					rollOver: 50,
				});
				await diceGamePage.navigate();
				await diceGamePage
					.assertThat()
					.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

				const diceBetData = new DiceAutobetTestData(autobetData);
				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await diceGamePage
					.steps()
					.startAndStopAutobetManually(diceBetData);

				await diceGamePage.authenticatedHeader
					.assertThat()
					.accountBalanceHasChanged(initialBalance);
			},
		);
	},
);
