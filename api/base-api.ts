import { HttpMethod } from "@enums/api/http-methods";
import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { RequestParameters } from "../core/api/interfaces/request-parameters";
import { logger } from "@logger/logger";
import { KnownError, PayloadType } from "@core/types";
import { handleError } from "@core/api/error-handler";

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

	// The request module from Playwright does not have a newContext method directly on it.
	// Instead, the newContext method is available on an instance of APIRequestContext, which is obtained by calling request.newContext()

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
	 * @param {RequestParameters} parameters - The parameters for the request, including endpoint, headers, data, params, and timeout.
	 * @returns {Promise<APIResponse>} A promise resolving to the API response.
	 */
	private async makeRequest(
		method: HttpMethod,
		parameters: RequestParameters,
	): Promise<APIResponse> {
		const { endpoint, headers, data, params, timeout } = parameters;
		const context = await this.context;
		const url = this.concatenateUrl(endpoint);

		try {
			const response = await context[method](url, {
				headers: { ...this.requestHeaders, ...headers },
				...(data && { data }),
				...(params && { params }),
				...(timeout && { timeout }),
			});

			if (!response.ok()) {
				const error: KnownError = new Error(`HTTP Error ${response.status()}: ${response.statusText()}`);
				error.response = response;
				throw error;
			}

			return response;
		} catch (error) {
			handleError(error as KnownError);
			throw error;
		}
	}



	/**
	 * Makes a GET request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the GET request, including endpoint, headers, params, and timeout.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async get(parameters: RequestParameters): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.GET, parameters);
	}

	/**
	 * Makes a POST request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the POST request, including endpoint, headers, data, params, and timeout.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async post(parameters: RequestParameters): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.POST, parameters);
	}

	/**
	 * Makes a PUT request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the PUT request, including endpoint, headers, data, params, and timeout.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async put(parameters: RequestParameters): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.PUT, parameters);
	}

	/**
	 * Makes a DELETE request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the DELETE request, including endpoint, headers, data, params, and timeout.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async delete(parameters: RequestParameters): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.DELETE, parameters);
	}

	/**
	 * Makes a PATCH request.
	 *
	 * @param {RequestParameters} parameters - The parameters for the PATCH request, including endpoint, headers, data, params, and timeout.
	 * @returns {Promise<APIResponse>} The API response.
	 */
	public async patch(parameters: RequestParameters): Promise<APIResponse> {
		return this.makeRequest(HttpMethod.PATCH, parameters);
	}
}
