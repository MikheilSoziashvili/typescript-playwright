import { APIRequestContext } from "@playwright/test";

export type TestUserConfigurationObject = {
	username: string;
	password: string;
	role: string;
	tags: string[];
	affCode?: string;
	additional_info: string;
};

export type CredentialsType = {
	username: string;
	password: string;
	email?: string;
};

export type XmlData = {
	testsuites: { testsuite: XmlDataTestSuite[] };
};

export type XmlDataTestSuite = { testcase: XmlDataTestCase[] };
export type XmlDataTestCase = {
	$: XmlData$;
	properties?: XmlDataProperty[];
};

export type XmlDataProperty = { property: { $: XmlData$ }[] };
export type XmlData$ = {
	name: string;
	value?: string;
};

export type ProxyCredentialsType = {
	server: string;
	username: string;
	password: string;
};

export type PayloadType =
	| Record<string, string | number | boolean | object>
	| string;

export type BasePageNavigationParametersType = {
	endpoint?: { path: string; id?: string; param?: string };
	link?: string;
	cookies?: { clearCookies: boolean };
};

export type RequestOptions = NonNullable<
	Parameters<APIRequestContext["fetch"]>[1]
>;
