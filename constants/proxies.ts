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
export const FR_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8011");

// Slovakia server - soft blocked
export const SK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8012");

// Italia server
export const IT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8013");

// Austria server
export const AT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8014");

// Canada server
export const CA_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8015");

// Poland server
export const PL_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8016");

// Ireland servers
export const IE_PROXY_CREDENTIALS_1 =
	createProxyCredentials("dc.oxylabs.io:8017");

export const IE_PROXY_CREDENTIALS_2 =
	createProxyCredentials("dc.oxylabs.io:8018");

export const IE_PROXY_CREDENTIALS_3 =
	createProxyCredentials("dc.oxylabs.io:8019");

// Czeck Republic server
export const CZ_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8020");
