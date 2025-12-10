import { GameProvider } from "@enums/casino-game";
import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { BookOfPyramidsPage } from "./bgaming/book-of-pyramids/book-of-pyramids-page";
import { CasinoGamesUnifiedPage } from "./casino-games-page";
import { CashVaultIPage } from "./hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import { BookOfArabiaPage } from "./wickedgames/book-of-arabia/book-of-arabia-page";
import { LiveBaccaratSqueezePage } from "./evolution-gaming/live-baccarat-squeeze/live-baccarat-squeeze-page";
import { ZuluGoldPage } from "./elk-studios/zulu-gold/zulu-gold-page";
import { CasinoGameConfig } from "@core/interfaces";
import { SweetBonanzaPage } from "./pragmatic-play/sweet-bonanza/sweet-bonanza-page";

export class CasinoGamesPageAsserter extends BaseAsserter<CasinoGamesUnifiedPage> {
	public constructor(page: CasinoGamesUnifiedPage) {
		super(page);
	}

	/**
	 * Waits for the game to load successfully.
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @returns A promise that resolves when the game has loaded
	 */
	@step(
		"Wait for game load successfully for {config.gameProvider}/{config.gameName}",
	)
	public async waitForGameLoadSuccessfully(
		config: CasinoGameConfig,
	): Promise<void> {
		const gamePage = this.gamdomPage.getGamePage(config);

		switch (config.gameProvider) {
			case GameProvider.BGAMING: {
				const bookOfPyramidsPage = gamePage as BookOfPyramidsPage;
				await bookOfPyramidsPage.assertThat().spinButtonIsDisplayed();
				break;
			}
			case GameProvider.HACKSAW_GAMING: {
				const cashVaultIPage = gamePage as CashVaultIPage;
				await cashVaultIPage.steps().refreshUntilGameIsLoaded();
				break;
			}
			case GameProvider.WICKED_GAMES: {
				const bookOfArabiaPage = gamePage as BookOfArabiaPage;
				await bookOfArabiaPage.assertThat().ensureGameLoaded();
				break;
			}
			case GameProvider.EVOLUTION_GAMING: {
				const liveBaccaratSqueezePage =
					gamePage as LiveBaccaratSqueezePage;
				await liveBaccaratSqueezePage.steps().gameIsLoaded();
				break;
			}
			case GameProvider.ELK_STUDIOS: {
				const zuluGoldPage = gamePage as ZuluGoldPage;
				await zuluGoldPage.assertThat().nextButtonVisible();
				break;
			}
			case GameProvider.PRAGMATIC_PLAY: {
				const sweetBonanzaPage = gamePage as SweetBonanzaPage;
				await sweetBonanzaPage.assertThat().nextButtonVisible();
				break;
			}
			default: {
				throw new Error(
					`Unhandled game provider: ${String(config.gameProvider)}`,
				);
			}
		}
	}

	/**
	 * Waits for the game round to finish.
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @returns A promise that resolves when the game round has finished
	 */
	@step(
		"Wait for game round finish for {config.gameProvider}/{config.gameName}",
	)
	public async waitForCasinoGameRoundFinish(
		config: CasinoGameConfig,
	): Promise<void> {
		const gamePage = this.gamdomPage.getGamePage(config);

		switch (config.gameProvider) {
			case GameProvider.BGAMING: {
				const bookOfPyramidsPage = gamePage as BookOfPyramidsPage;
				await bookOfPyramidsPage.assertThat().spinButtonIsDisplayed();
				break;
			}
			case GameProvider.HACKSAW_GAMING: {
				const cashVaultIPage = gamePage as CashVaultIPage;
				await cashVaultIPage.assertThat().roundIsFinished();
				break;
			}
			case GameProvider.WICKED_GAMES: {
				const bookOfArabiaPage = gamePage as BookOfArabiaPage;
				await bookOfArabiaPage.assertThat().spinButtonIsIdle();
				break;
			}
			case GameProvider.EVOLUTION_GAMING: {
				const liveBaccaratSqueezePage =
					gamePage as LiveBaccaratSqueezePage;
				await liveBaccaratSqueezePage
					.assertThat()
					.gameRoundResultAppeared();
				await this.gamdomPage.setExtraHTTPHeaders({
					Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
				});
				break;
			}
			case GameProvider.ELK_STUDIOS: {
				const zuluGoldPage = gamePage as ZuluGoldPage;
				await zuluGoldPage.assertThat().waitForRoundFinish();
				break;
			}
			case GameProvider.PRAGMATIC_PLAY: {
				const sweetBonanzaPage = gamePage as SweetBonanzaPage;
				await sweetBonanzaPage.assertThat().waitForRoundFinish();
				break;
			}
			default: {
				throw new Error(
					`Unhandled game provider: ${String(config.gameProvider)}`,
				);
			}
		}
	}
}
