import { ApiEndpoints } from "@enums/api-endpoints";
import { OriginalGame } from "@enums/original-games";
import { QueryParam } from "@enums/query-params";

const gameKeyOverrides: Partial<Record<OriginalGame, string>> = {
	[OriginalGame.PocketDice]: "pocketDice",
};

export function toGameKey(game: OriginalGame): string {
	return gameKeyOverrides[game] ?? game.toLowerCase();
}

export function buildStreamInitEndpoint(gameKey: string): string {
	return `/stream/${gameKey}/rpc/init`;
}

export function buildInitTokenEndpoint(gameKey: string): string {
	return `/${gameKey}${ApiEndpoints.CLIENT_API}/${gameKey}${ApiEndpoints.INIT_TOKEN}`;
}

export function buildGameInitEndpoint(gameKey: string, token: string): string {
	return `/_proxied/games/${gameKey}${ApiEndpoints.CLIENT_API}/${gameKey}${ApiEndpoints.INIT_TOKEN}${token}`;
}

export function buildPlinkoPlaceBetEndpoint(token: string): string {
	return `${ApiEndpoints.PLINKO_PLACE_BET}?${QueryParam.TOKEN}=${token}`;
}

export function buildKenoPlaceBetEndpoint(token: string): string {
	return `${ApiEndpoints.KENO_PLACE_BET}?${QueryParam.TOKEN}=${token}`;
}

export function buildMinesPlaceBetEndpoint(token: string): string {
	return `${ApiEndpoints.MINES_PLACE_BET}?${QueryParam.TOKEN}=${token}`;
}

export function buildPocketDicePlaceBetEndpoint(token: string): string {
	return `${ApiEndpoints.POCKET_DICE_PLACE_BET}?${QueryParam.TOKEN}=${token}`;
}

export function buildLimboPlaceBetEndpoint(token: string): string {
	return `${ApiEndpoints.LIMBO_PLACE_BET}?${QueryParam.TOKEN}=${token}`;
}

export function buildBlackjackPlaceBetEndpoint(token: string): string {
	return `${ApiEndpoints.BLACKJACK_PLACE_BET}?${QueryParam.TOKEN}=${token}`;
}
