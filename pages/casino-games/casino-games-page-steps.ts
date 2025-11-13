import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { CasinoGamesUnifiedPage } from "./casino-games-page";
import { GameProvider } from "@enums/casino-game";
import { useProviderBearerFromAuthenticate } from "@core/utils/utils";
import { WICKED_GAMES_AUTH } from "@constants/auth-casino-game-providers";
import { CasinoGameConfig } from "@core/interfaces";

export class CasinoGamesPageSteps extends BasePageStep<CasinoGamesUnifiedPage> {
	public constructor(gamdomPage: CasinoGamesUnifiedPage) {
		super(gamdomPage);
	}

	/**
	 * Sets up provider-specific authentication and configuration.
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @returns A promise that resolves when setup is complete
	 */
	@step("Setup provider authentication for {config.gameProvider}")
	public async setupProviderAuthentication(
		config: CasinoGameConfig,
	): Promise<void> {
		switch (config.gameProvider) {
			case GameProvider.WICKED_GAMES: {
				await useProviderBearerFromAuthenticate(this.gamdomPage.page, {
					host: WICKED_GAMES_AUTH.HOST,
					authPath: WICKED_GAMES_AUTH.AUTH_PATH,
					tokenJsonKey: WICKED_GAMES_AUTH.TOKEN_KEY,
				});
				break;
			}
			case GameProvider.BGAMING:
			case GameProvider.HACKSAW_GAMING:
				// No additional setup needed for these providers
				break;
			default:
				throw new Error(
					`Unhandled game provider: ${String(config.gameProvider)}`,
				);
		}
	}

	/**
	 * Plays a complete game round successfully by combining:
	 * 1. Wait for game to load successfully
	 * 2. Play the game round
	 * 3. Wait for the game round to finish
	 *
	 * @param config - The game configuration containing gameName and gameProvider
	 * @returns A promise that resolves when the complete round has been played
	 */
	@step(
		"Play game round successfully for {config.gameProvider}/{config.gameName}",
	)
	public async playCasinoGameRoundSuccessfully(
		config: CasinoGameConfig,
	): Promise<void> {
		await this.gamdomPage.assertThat().waitForGameLoadSuccessfully(config);
		await this.gamdomPage.playCasinoGameRound(config);
		await this.gamdomPage.assertThat().waitForCasinoGameRoundFinish(config);
	}
}
