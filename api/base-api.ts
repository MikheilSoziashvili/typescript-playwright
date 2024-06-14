import { HttpMethod } from "@enums/http-methods";
import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { RequestParameters } from "./request-parameters";
import { logger } from "@logger/logger";

/**
 * This BaseApi class serves as a foundation for all controllers managing HTTP requests.
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
		this.requestHeaders["Content-Type"] = "application/json"; // Could be a weak point (for example x-ray api uses xml)
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
	 * Sets a specific header for HTTP requests.
	 *
	 * @param headerKey The key/name of the header.
	 * @param headerValue The value of the header.
	 * @returns The instance of this controller, allowing for method chaining.
	 */
	public setHeader(headerKey: string, headerValue: string): this {
		this.requestHeaders[headerKey] = headerValue;
		return this;
	}

	/**
	 * Logs the current set of request headers to the console.
	 */
	public logRequestHeaders(): void {
		logger.info("Request headers:", this.requestHeaders);
	}

	/**
	 * Makes an HTTP request using the Playwright library, configured with the specified method,
	 * URL, body data, and query parameters. It also handles errors directly,
	 * including both Playwright errors and HTTP status error responses.
	 *
	 * @param method The HTTP method to use.
	 * @param parameters The parameters for the request.
	 * @returns A promise resolving to the response data.
	 */
	private async makeRequest(
		method: HttpMethod,
		parameters: RequestParameters,
	): Promise<APIResponse> {
		const { endpoint, headers, data, params, timeout } = parameters;
		const context = await this.context;
		const response = await context[method](this.baseUrl + endpoint, {
			headers: { ...this.requestHeaders, ...headers },
			...(data && { data }), // '&&' is used in order to conditionally add properties in the object preventing properties being set to 'undefined'.
			...(params && { params }),
			...(timeout && { timeout }),
		});
		if (response.ok()) {
			return response;
		} else {
			throw new Error(
				`Request failed: ${response.status()} ${response.statusText()}`,
			);
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
