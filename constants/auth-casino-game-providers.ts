import {
	wickedGamesHostPattern,
	wickedGamesAuthPathPattern,
} from "@support/regex-patterns";

export const WICKED_GAMES_AUTH = {
	HOST: wickedGamesHostPattern,
	AUTH_PATH: wickedGamesAuthPathPattern,
	TOKEN_KEY: "token",
};
