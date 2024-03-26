export type TestUserConfigurationObject = {
	username: string;
	password: string;
	role: string;
	tags: string[];
	affCode?: string;
	additional_info: string;
};

export type credentialsType = {
	username: string;
	password: string;
	email?: string;
};

export type xmlData = {
	testsuites: { testsuite: xmlDataTestSuite[] };
};

export type xmlDataTestSuite = { testcase: xmlDataTestCase[] };
export type xmlDataTestCase = {
	$: xmlData$;
	properties?: xmlDataProperty[];
};

export type xmlDataProperty = { property: { $: xmlData$ }[] };
export type xmlData$ = {
	name: string;
	value?: string;
};
