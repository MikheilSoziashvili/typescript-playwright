import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export interface GamesBaseApiConfig {
	game: OriginalGame;
	errorMessage: GameErrorMessage;
	retryInterval: TimeoutSeconds;
	retryTimeout: TimeoutSeconds;
}
