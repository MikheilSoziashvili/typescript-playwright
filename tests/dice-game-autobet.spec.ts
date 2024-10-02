import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceAutobetTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";

const DICE_AUTOBET_CSV = "ENG-1415-dice-autobet.csv";

test.describe("Dice game autobet", () => {
	test.use(storageStateNewUserAPI());

	for (const betData of parse_csv(DATASETS_DIR, DICE_AUTOBET_CSV) as {
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
});
