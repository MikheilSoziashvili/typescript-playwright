import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceAutobetTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "../enums/csv-file-name";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";

test.describe("Dice game autobet", () => {
	test.use(storageStateNewUserAPI());

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
		test(`"[ENG-1415] Dice - autobet with roll over ${betData.rollOver} @originals"`, async ({
			diceGamePage,
		}) => {
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
				.balanceAfterAutoBetIsCorrect(initialBalance, diceBetData);
		});
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
		test(`[ENG-2843] Dice - Autobet - Increase by on condition ${record.input}`, async ({
			diceGamePage,
		}) => {
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
			await diceGamePage.assertThat().lastBetValueIs(15.0);
		});
	});
});
