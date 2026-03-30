import { BaseMap } from "@base/base-map";
import { SokGame } from "@enums/sok-game";
import { Locator, Page } from "@playwright/test";

export class SokGamesPageMap extends BaseMap {
	private game!: SokGame;

	private static readonly BALANCE_TESTIDS: Record<SokGame, string> = {
		[SokGame.Mines]: "Mines-balance",
		[SokGame.Plinko]: "Plinko-balance",
		[SokGame.Keno]: "Keno-balance",
		[SokGame.PocketDice]: "PocketDice-balance",
		[SokGame.Limbo]: "Limbo-balance",
		[SokGame.Blackjack]: "Blackjack-balance",
	};

	public constructor(page: Page) {
		super(page);
	}

	public setGame(game: SokGame): void {
		this.game = game;
	}

	public get betAmountInput(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get balanceContainer(): Locator {
		return this.page.getByTestId(
			SokGamesPageMap.BALANCE_TESTIDS[this.game],
		);
	}

	public currencyIcon(svgName: string): Locator {
		return this.balanceContainer.locator(`img[src*="${svgName}."]`);
	}
}
