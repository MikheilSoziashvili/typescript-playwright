export interface RequestParameters {
	endpoint: string;
	headers?: Record<string, string>;
	data?: Record<string, string | number | boolean | object> | string;
	params?: Record<string, string>;
	timeout?: number;
}
