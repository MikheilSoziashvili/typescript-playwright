import { APIRequestContext, APIResponse, request } from "@playwright/test";

export class BaseApi {
	readonly context: Promise<APIRequestContext>;
	readonly baseUrl: string;

	// The request module from Playwright does not have a newContext method directly on it.
	// Instead, the newContext method is available on an instance of APIRequestContext, which is obtained by calling request.newContext()
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.context = request.newContext({
			baseURL: this.baseUrl,
			ignoreHTTPSErrors: true,
		});
	}

	public async get(parameters: {
		endpoint: string;
		headers?: Record<string, string>;
		form?: Record<string, string>;
		data?: object | string;
		timeout?: number;
	}): Promise<APIResponse> {
		const { endpoint, headers, form, data, timeout } = parameters;
		return (await this.context).get(this.baseUrl + endpoint, {
			headers,
			form,
			data,
			timeout,
		});
	}

	public async post(
		url: string,
		data: object | string,
		headers?: Record<string, string>,
		params?: Record<string, string>,
		timeout?: number,
	): Promise<APIResponse> {
		return (await this.context).post(this.baseUrl + url, {
			headers,
			data,
			params,
			timeout,
		});
	}

	// TODO: Add PUT, POST, PATCH and DELETE
}
