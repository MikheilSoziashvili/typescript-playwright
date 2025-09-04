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

// USA server - blocked
export const US_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8001");

// United Kingdom server - soft blocked - removed from the e2e-staging config as the CI servers are in the UK
export const UK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8002");

// Germany server - soft blocked
export const DE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8003");

// Netherlands server - blocked
export const NL_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8004");

// Japan server
export const JP_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8005");

// Belgium server - blocked
export const BE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8006");

// Spain server - soft blocked
export const ES_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8007");

// Australia server - soft blocked
export const AU_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8008");

// Denmark server - soft blocked
export const DK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8009");

// Portugal server - soft blocked
export const PT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8010");

// France server - soft blocked
export const FR_PROXY_CREDENTIALS = createProxyCredentials(
	"fr.oxylabs.io:    ", //TBD
);
