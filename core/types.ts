export type TestUserConfigurationObject = {
	username: string;
	password: string;
	role: string;
	tags: Array<string>;
	affCode?: string;
	additional_info: string;
};

export type credentialsType = { username: string, password: string, email?: string };
