import { ProxyCredentialsType } from "@core/types/types";
import * as Configuration from "configuration";

const createProxyCredentials = (
	server: string,
	username = Configuration.oxylabs.username,
	password = Configuration.oxylabs.password,
): ProxyCredentialsType => ({
	server,
	username,
	password,
});

// USA server
export const US_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8001");
// Netherlands server
export const NL_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8004");
// Belarus server - not working
export const BL_PROXY_CREDENTIALS = createProxyCredentials(
	"by-pr.oxylabs.io:15000",
);
