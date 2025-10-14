import { ApiEndpoints } from "@enums/api-endpoints";

export function buildInitTokenEndpoint(gameKey: string): string {
  return `/${gameKey}${ApiEndpoints.CLIENT_API}/${gameKey}${ApiEndpoints.INIT_TOKEN}`;
}