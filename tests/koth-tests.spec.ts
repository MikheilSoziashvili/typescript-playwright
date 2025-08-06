import { KOTH_NAME_PREFIX } from "@constants/koth";
import {
	KOTH_DAILY_ENDPOINT,
	KOTH_ENDPOINT,
	KOTH_WEEKLY_ENDPOINT,
} from "@constants/page-endpoints";
import { RegisterTestData } from "@dtos/test-data";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import {
	PlinkoRiskOption,
	PlinkoRowsOption,
} from "@enums/plinko/plinko-game-options";
import { Timeout } from "@enums/timeout";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const userData = new RegisterTestData();

type GameTestData = {
	game: OriginalGame;
	betAmount: number;
	betOption?:
		| number
		| RouletteBetColor
		| HiloBetOption
		| { rowsValue?: PlinkoRowsOption; riskValue?: PlinkoRiskOption }
		| number;
};

const gameTestData: GameTestData[] = [
	{
		game: OriginalGame.Dice,
		betAmount: 123,
		betOption: 1.1,
	},
	{
		game: OriginalGame.Crash,
		betAmount: 234,
		betOption: 1.1,
	},
	{
		game: OriginalGame.Roulette,
		betAmount: 345,
		betOption: RouletteBetColor.BLACK,
	},
	{
		game: OriginalGame.HiLo,
		betAmount: 456,
		betOption: HiloBetOption.BLACK,
	},
	{
		game: OriginalGame.Plinko,
		betAmount: 567,
		betOption: {
			rowsValue: PlinkoRowsOption.ROWS_12,
			riskValue: PlinkoRiskOption.MEDIUM,
		},
	},
	{
		game: OriginalGame.Mines,
		betAmount: 100,
		betOption: 2,
	},
];

test.describe("KoTH game tests", () => {
	test.use(
		storageStateNewUserDB({
			username: userData.username,
			password: userData.password,
			email: userData.email,
		}),
	);
	test.slow();
	test.setTimeout(Timeout.SUPER_MAX);

	test(`[ENG-6457] KoTH - Verify wagered amounts from all Originals games are displayed in KOTH leaderboards`, async ({
		kothPage,
		originalsPage,
	}) => {
		let totalWageredAmount = 0;
		const kothEndpoints = [
			KOTH_ENDPOINT,
			KOTH_DAILY_ENDPOINT,
			KOTH_WEEKLY_ENDPOINT,
		];
		for (const data of gameTestData) {
			await originalsPage.navigateToGame(data.game);
			await originalsPage.placeBet(
				data.game,
				data.betAmount,
				data.betOption,
			);
			await originalsPage.waitForGameRoundFinish(data.game);
			totalWageredAmount += data.betAmount;

			for (const kothEndpoint of kothEndpoints) {
				await kothPage.navigateToKothEvent(`${kothEndpoint}`);
				await kothPage
					.assertThat()
					.verifyKothWaggerAmountProfileCard(totalWageredAmount);
			}

			await kothPage.steps().navigateToKothEventByName(KOTH_NAME_PREFIX);

			await kothPage
				.assertThat()
				.verifyKothWaggerAmountProfileCard(totalWageredAmount);
		}
	});
});
