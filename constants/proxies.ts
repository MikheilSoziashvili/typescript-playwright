import { ProxyCredentialsType } from "core/types";

// US server
export const US_PROXY_CREDENTIALS: ProxyCredentialsType = {
	server: "us-pr.oxylabs.io:10001",
	username: "gamdomautomation",
	password: "Gamdomautomation1",
};

// NL server
export const NL_PROXY_CREDENTIALS: ProxyCredentialsType = {
	server: "nl-pr.oxylabs.io:20000",
	username: "gamdomautomation",
	password: "Gamdomautomation1",
};

// BL server
// TODO: check why not working, maybe when change proxy provider will work
export const BL_PROXY_CREDENTIALS: ProxyCredentialsType = {
	server: "by-pr.oxylabs.io:15000",
	username: "gamdomautomation",
	password: "Gamdomautomation1",
};
