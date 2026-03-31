import { BrowserUserSession } from "@core/browser-session-mngmt";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { BaseTestFlow, testFlow } from "@test-flows";
import { predefined } from "test-data/sources/predefined";

const placeBetByGame: Record<
	string,
	(user: BrowserUserSession, amount: number) => Promise<void>
> = {
	[OriginalGame.Plinko]: async (user, amount) => {
		await (await user.apis.plinkoApi).placeBetUntilSuccessful(amount);
	},
	[OriginalGame.Mines]: async (user, amount) => {
		await (await user.apis.minesApi).placeBetUntilSuccessful(amount);
	},
	[OriginalGame.PocketDice]: async (user, amount) => {
		await (await user.apis.pocketDiceApi).placeBetUntilSuccessful(amount);
	},
	[OriginalGame.Crash]: async (user, amount) => {
		await (
			await user.apis.crashApi
		).placeBetUntilSuccessful(
			amount,
			predefined.crash.defaultAutoCashOutApi,
		);
	},
	[OriginalGame.Dice]: async (user, amount) => {
		await (
			await user.apis.diceApi
		).placeBetUntilSuccessful(amount, predefined.dice.defaultRollOverApi);
	},
	[OriginalGame.Roulette]: async (user, amount) => {
		await (
			await user.apis.rouletteApi
		).placeBetUntilSuccessful(amount, RouletteBetColor.RED);
	},
	[OriginalGame.HiLo]: async (user, amount) => {
		await (
			await user.apis.hiloApi
		).placeBetUntilSuccessful(amount, HiloBetOption.RED);
	},
	[OriginalGame.Keno]: async (user, amount) => {
		await (await user.apis.kenoApi).placeBetUntilSuccessful(amount);
	},
	[OriginalGame.Limbo]: async (user, amount) => {
		await (await user.apis.limboApi).placeBetUntilSuccessful(amount);
	},
	[OriginalGame.Blackjack]: async (user, amount) => {
		await (await user.apis.blackjackApi).placeBetUntilSuccessful(amount);
	},
};

export class OriginalsBetPlacementTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Place bet on original game via API")
	public async placeBet(
		user: BrowserUserSession,
		game: string,
		betAmountInCoins: number,
	): Promise<number> {
		await placeBetByGame[game](user, betAmountInCoins);
		return betAmountInCoins;
	}

	public isOriginalGame(game: string): boolean {
		return game in placeBetByGame;
	}
}
