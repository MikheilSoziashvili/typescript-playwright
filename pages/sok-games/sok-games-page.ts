import { SokGame } from "@enums/sok-game";
import { BlackjackGamePage } from "@pages/blackjack-game-page/blackjack-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";
import { LimboGamePage } from "@pages/limbo-game-page/limbo-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { PocketDicePage } from "@pages/pocket-dice-game/pocket-dice-page";
import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { SokGamesPageAsserter } from "./sok-games-page-asserter";
import { SokGamesPageMap } from "./sok-games-page-map";
import { SokGamesPageSteps } from "./sok-games-page-steps";
import { GameActions } from "@core/interfaces";

export class SokGamesPage extends BasePage<SokGamesPageMap> {
	private readonly gameActions: Record<SokGame, GameActions>;
	private currentGame!: SokGame;

	public constructor(
		page: Page,
		minesGamePage: MinesGamePage,
		plinkoGamePage: PlinkoGamePage,
		kenoGamePage: KenoGamePage,
		pocketDicePage: PocketDicePage,
		limboGamePage: LimboGamePage,
		blackjackGamePage: BlackjackGamePage,
	) {
		super(page, new SokGamesPageMap(page));
		this.gameActions = {
			[SokGame.Mines]: minesGamePage,
			[SokGame.Plinko]: plinkoGamePage,
			[SokGame.Keno]: kenoGamePage,
			[SokGame.PocketDice]: {
				navigate: () =>
					pocketDicePage.steps().navigateAndWaitForGameToLoad(),
				pressMinButton: () => pocketDicePage.pressMinButton(),
				placeSingleBet: () => pocketDicePage.placeSingleBet(),
			},
			[SokGame.Limbo]: limboGamePage,
			[SokGame.Blackjack]: blackjackGamePage,
		};
	}

	public forGame(game: SokGame): this {
		this.currentGame = game;
		this.map.setGame(game);
		return this;
	}

	public override assertThat(): SokGamesPageAsserter {
		return new SokGamesPageAsserter(this);
	}

	public steps(): SokGamesPageSteps {
		return new SokGamesPageSteps(this);
	}

	@step("Navigate to SOK game")
	public override async navigate(): Promise<void> {
		await this.gameActions[this.currentGame].navigate();
	}

	@step("Press MIN button")
	public async pressMinButton(): Promise<void> {
		await this.gameActions[this.currentGame].pressMinButton();
	}

	@step("Place a single bet and finish round")
	public async placeSingleBet(): Promise<void> {
		await this.gameActions[this.currentGame].placeSingleBet();
	}
}
