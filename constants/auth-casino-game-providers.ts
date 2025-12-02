import {
	wickedGamesHostPattern,
	wickedGamesAuthPathPattern,
	aleaPlayHostPattern,
	aleaPlayAuthPathPattern,
} from "@support/regex-patterns";

export const WICKED_GAMES_AUTH = {
	HOST: wickedGamesHostPattern,
	AUTH_PATH: wickedGamesAuthPathPattern,
	TOKEN_KEY: "token",
};

export const ALEA_PLAY_AUTH = {
	HOST: aleaPlayHostPattern,
	AUTH_PATH: aleaPlayAuthPathPattern,
	TOKEN_KEY: "sessionId",
};
