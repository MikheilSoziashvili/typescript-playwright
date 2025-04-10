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

// United Kingdom server
export const UK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8002");

// Germany server
export const DE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8003");

// Netherlands server
export const NL_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8004");

// Belgium server
export const BE_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8006");

// Spain server
export const ES_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8007");

// Australia server
export const AU_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8008");

// Denmark server
export const DK_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8009");

// Portugal server
export const PT_PROXY_CREDENTIALS =
	createProxyCredentials("dc.oxylabs.io:8010");

//France server
export const FR_PROXY_CREDENTIALS = createProxyCredentials(
	"fr.oxylabs.io:    ", //TBD
);
