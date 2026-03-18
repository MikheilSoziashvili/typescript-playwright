import { ApiEndpoints } from "@enums/api-endpoints";
import { QueryParam } from "@enums/query-params";

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
