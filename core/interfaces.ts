export interface JsonData {
	[key: string]: string | number | boolean | JsonData | JsonData[];
}

export interface RegisterTestDataParams {
	email?: string;
	username?: string;
	password?: string;
}

export interface WaitUntilOptions {
	errorMessage: string;
	intervalSeconds?: number;
	timeoutSeconds?: number;
}
