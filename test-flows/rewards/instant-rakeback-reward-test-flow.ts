import { BrowserUserSession } from "@core/browser-session-mngmt";
import { ApiPromises } from "@core/types/browser-session-mngmt-types";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { predefined } from "test-data/sources/predefined";
import { APIResponse } from "@playwright/test";
import { BaseTestFlow, testFlow } from "@test-flows";

const placeBetForGame: Record<
	OriginalGame,
	(apis: ApiPromises) => Promise<APIResponse>
> = {
	[OriginalGame.Crash]: async (apis) =>
		(await apis.crashApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
			predefined.crash.defaultAutoCashOutApi,
		),
	[OriginalGame.Dice]: async (apis) =>
		(await apis.diceApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
			predefined.dice.defaultRollOverApi,
		),
	[OriginalGame.Roulette]: async (apis) =>
		(await apis.rouletteApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
			RouletteBetColor.RED,
		),
	[OriginalGame.HiLo]: async (apis) =>
		(await apis.hiloApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
			HiloBetOption.RED,
		),
	[OriginalGame.Plinko]: async (apis) =>
		(await apis.plinkoApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
		),
	[OriginalGame.Keno]: async (apis) =>
		(await apis.kenoApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
		),
	[OriginalGame.Mines]: async (apis) =>
		(await apis.minesApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
		),
	[OriginalGame.PocketDice]: async (apis) =>
		(await apis.pocketDiceApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
		),
	[OriginalGame.Limbo]: async (apis) =>
		(await apis.limboApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
		),
	[OriginalGame.Blackjack]: async (apis) =>
		(await apis.blackjackApi).placeBetUntilSuccessful(
			predefined.originalGames.betAmountCoins,
		),
};

export class InstantRakebackRewardTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Place bet and verify instant rakeback reward")
	public async placeBetAndVerifyRakeback(params: {
		user: BrowserUserSession;
		game: OriginalGame;
		houseEdge: number;
	}): Promise<void> {
		const { user, game, houseEdge } = params;

		await placeBetForGame[game](user.apis);
		await user.pages.homePage.navigate();
		await user.pages.rewardsPage.navigate();
		await user.pages.rewardsPage
			.assertThat()
			.instantRakebackRewardIsCorrect(
				predefined.originalGames.betAmount,
				predefined.originalGames.rakebackPercentage,
				houseEdge,
			);
	}
}
