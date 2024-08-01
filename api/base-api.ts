import { HttpMethod } from "@enums/api/http-methods";
import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { RequestParameters } from "../core/api/interfaces/request-parameters";
import { logger } from "@logger/logger";
import { handleError } from "@core/api/error-handler";
import { PayloadType } from "@core/types/types";
import { KnownError } from "@core/types/error-types";

// Infer the type for the options parameter from Playwright's fetch method
export type RequestOptions = NonNullable<
	Parameters<APIRequestContext["fetch"]>[1]
>;

/**
 * This BaseApi class serves as a foundation for managing HTTP requests.
 */
export class BaseApi {
	private context: Promise<APIRequestContext>;
	private baseUrl: string;
	private requestHeaders: Record<string, string> = {};

	/**
	 * Initializes the request context and sets the base URL and default headers.
	 *
	 * @param baseUrl The base URL for all requests made by this instance.
	 */
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.context = request.newContext({
			baseURL: this.baseUrl,
			ignoreHTTPSErrors: true,
		});
		this.requestHeaders["Content-Type"] = "application/json";
	}

	/**
	 * Provides access to the request context.
	 *
	 * @returns The API request context.
	 */
	public async getContext(): Promise<APIRequestContext> {
		return this.context;
	}

	/**
	 * Sets multiple headers for HTTP requests.
	 *
	 * @param headers - An object containing header key-value pairs.
	 * @returns {this} The instance, allowing for method chaining.
	 */
	public setHeaders(headers: Record<string, string>): this {
		this.requestHeaders = { ...this.requestHeaders, ...headers };
		return this;
	}

	/**
	 * Logs the current set of request headers to the console.
	 */
	public logRequestHeaders(): void {
		logger.info("Request headers:", this.requestHeaders);
	}

	/**
	 * Concatenates base URL and endpoint, ensuring there is exactly one slash between them.
	 *
	 * @param endpoint - The endpoint to be concatenated with the base URL.
	 * @returns {string} The concatenated URL.
	 */
	private concatenateUrl(endpoint: string): string {
		return new URL(endpoint, this.baseUrl).toString();
	}

	/**
	 * Constructs the request parameters object.
	 *
	 * @param endpoint - The endpoint for the request.
	 * @param data - The payload for the request.
	 * @param _headers - Optional additional headers for the request.
	 * @returns {RequestParameters} The constructed request parameters object.
	 */
	protected buildParameters(
		endpoint: string,
		data?: PayloadType,
		_headers?: Record<string, string>,
	): RequestParameters {
		const headers = _headers
			? { ...this.requestHeaders, ..._headers }
			: this.requestHeaders;
		return {
			endpoint,
			headers,
			data,
		};
	}

	/**
	 * Makes an HTTP request using the Playwright library, configured with the specified method,
	 * URL, body data, and query parameters. It also handles errors directly,
	 * including both Playwright errors and HTTP status error responses.
	 *
	 * @param {HttpMethod} method - The HTTP method to use (GET, POST, PUT, DELETE, PATCH).
	 * @param {RequestParameters} parameters - The parameters for the request, including endpoint, headers, data, and params.
	 * @param {RequestOptions} options - Additional options for the request.
	 * @returns {Promise<APIResponse>} A promise resolving to the API response.
	 */
	private async makeRequest(
		method: HttpMethod,
		parameters: RequestParameters,
		options: RequestOptions = {},
	): Promise<APIResponse> {
		const { endpoint, headers, data, params } = parameters;
		const context = await this.context;
		const url = this.concatenateUrl(endpoint);

		/* eslint-disable-next-line object-shorthand */
		const requestOptions: RequestOptions = {
			headers: { ...this.requestHeaders, ...headers },
			data,
			params,
			...options,
		};

		try {
			const response = await context.fetch(url, {
				method,
				...requestOptions,
			});

			return response;
		} catch (error) {
			handleError(error as KnownError);
			throw error;
		}
	}

	/**
	 * Makes a GET request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the GET request, including endpoint, headers, and params.
	 * @param {RequestOptions} options - Additional options for the GET request.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async get(
		parameters: RequestParameters,
		options?: RequestOptions,
	): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.GET, parameters, options);
	}

	/**
	 * Makes a POST request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the POST request, including endpoint, headers, data, and params.
	 * @param {RequestOptions} options - Additional options for the POST request.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async post(
		parameters: RequestParameters,
		options?: RequestOptions,
	): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.POST, parameters, options);
	}

	/**
	 * Makes a PUT request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the PUT request, including endpoint, headers, data, and params.
	 * @param {RequestOptions} options - Additional options for the PUT request.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async put(
		parameters: RequestParameters,
		options?: RequestOptions,
	): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.PUT, parameters, options);
	}

	/**
	 * Makes a DELETE request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the DELETE request, including endpoint, headers, data, and params.
	 * @param {RequestOptions} options - Additional options for the DELETE request.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async delete(
		parameters: RequestParameters,
		options?: RequestOptions,
	): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.DELETE, parameters, options);
	}

	/**
	 * Makes a PATCH request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the PATCH request, including endpoint, headers, data, and params.
	 * @param {RequestOptions} options - Additional options for the PATCH request.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async patch(
		parameters: RequestParameters,
		options?: RequestOptions,
	): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.PATCH, parameters, options);
	}
}
