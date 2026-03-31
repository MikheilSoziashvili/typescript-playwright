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

// Germany server - soft blocked, oauth disabled
export const DE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8001");

// Italy server
export const IT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8002");

// Austria server
export const AT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8003");

// Spain server - soft blocked
export const ES_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8004");

// Portugal server
export const PT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8005");

// Netherlands server - blocked
export const NL_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8006");

// Denmark server - soft blocked, oauth disabled for steam
export const DK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8007");

// France server - soft blocked, games blocked
export const FR_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8008");

// USA server - blocked
export const US_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8009");

// Japan server
export const JP_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8010");

// Canada server
export const CA_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8011");

// Belgium server - blocked
export const BE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8012");

// United Kingdom server - removed from the e2e-staging config as the CI servers are in the UK
export const UK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8013");

// Poland server - chat disabled in e2e-stg and e2e-qa env
export const PL_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8014");

// Australia server - soft blocked, games blocked
export const AU_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8015");

// Ireland server
export const IE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8016");

// Ireland server 2
export const IE_PROXY_CREDENTIALS_2 =
	createProxyCredentials("dc.oxylabs.io:8017");

// Ireland server 3
export const IE_PROXY_CREDENTIALS_3 =
	createProxyCredentials("dc.oxylabs.io:8018");

// Slovakia server - soft blocked, oauth disabled, soft blocked without login
export const SK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8019");

// Czech Republic server
export const CZ_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8020");
