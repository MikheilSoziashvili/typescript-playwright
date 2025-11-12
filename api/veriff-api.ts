import { CreateSessionRequest } from "@dtos/requests/veriff-api/create-session-request";
import { UploadMediaRequest } from "@dtos/requests/veriff-api/upload-media-request";
import { CreateSessionResponse } from "@dtos/responses/veriff-api/create-session-response";
import { UploadMediaResponse } from "@dtos/responses/veriff-api/upload-media-response";
import { SubmitSessionResponse } from "@dtos/responses/veriff-api/submit-session-response";
import { ApiEndpoints } from "@enums/api-endpoints";
import { expect, request } from "@playwright/test";
import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";
import * as crypto from "crypto";
import { HttpStatus } from "@enums/http-status";
import { SubmitSessionRequestStatus } from "@enums/verification-enums";

export class VeriffApi extends BaseApi {
	constructor(base_url: string = Configuration.veriffConfig.apiUrl) {
		super(base_url);

		// Override context with User-Agent for Veriff API to avoid CloudFront routing issues (reasonable explanation currently missing)
		this["context"] = request.newContext({
			baseURL: base_url,
			ignoreHTTPSErrors: true,
			extraHTTPHeaders: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
			},
		});
		this.setHeaders({
			"X-AUTH-CLIENT": `${process.env.VERIFF_PUBLISHABLE_KEY}`,
		});
	}

	/**
	 * Generates HMAC SHA256 signature for request data
	 * @param data - The request payload to sign
	 * @returns The HMAC signature as a hex string
	 */
	private generateHmacSignature(data: unknown): string {
		const privateKey = process.env.VERIFF_PRIVATE_KEY || "";
		const dataString = JSON.stringify(data);
		return crypto
			.createHmac("sha256", privateKey)
			.update(dataString)
			.digest("hex");
	}

	/**
	 * Creates a new verification session
	 * @param callback - The callback URL for the verification
	 * @param vendorData - The vendor data identifier
	 * @param _headers - Optional additional headers
	 * @returns Promise with the create session response
	 */
	public async createSession(
		callback: string,
		vendorData: string,
		_headers?: Record<string, string>,
	): Promise<CreateSessionResponse> {
		const payload: CreateSessionRequest = {
			verification: {
				callback,
				vendorData,
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.CREATE_SESSION,
			payload,
			_headers,
		);

		const response = await this.post(parameters);
		expect(response.status()).toBe(HttpStatus.CREATED);
		return response.json() as Promise<CreateSessionResponse>;
	}

	/**
	 * Extracts the session ID from the create session response
	 * @param response - The response from createSession
	 * @returns The session ID
	 */
	public getSessionIdFromResponse(response: CreateSessionResponse): string {
		return response.verification.id;
	}

	/**
	 * Uploads media (document image) to a verification session
	 * @param sessionId - The session ID to upload media to
	 * @param context - The context of the image (e.g., "document-front", "document-back", "face")
	 * @param content - The base64 encoded image data with data URI prefix
	 * @param _headers - Optional additional headers
	 * @returns Promise with the upload media response
	 */
	public async uploadMedia(
		sessionId: string,
		context: string,
		content: string,
		_headers?: Record<string, string>,
	): Promise<UploadMediaResponse> {
		const payload: UploadMediaRequest = {
			image: {
				context,
				content,
			},
		};

		const signature = this.generateHmacSignature(payload);
		const headers = this.setCustomHeaders(signature, _headers);

		const endpoint = ApiEndpoints.SESSION_MEDIA.replace(
			"{sessionId}",
			sessionId,
		);
		const parameters = this.buildParameters(endpoint, payload, headers);

		const response = await this.post(parameters);
		expect(response.status()).toBe(HttpStatus.OK);
		return response.json() as Promise<UploadMediaResponse>;
	}

	/**
	 * Submits a verification session for review
	 * @param sessionId - The session ID to submit
	 * @param _headers - Optional additional headers
	 * @returns Promise with the submit session response
	 */
	public async submitSession(
		sessionId: string,
		_headers?: Record<string, string>,
	): Promise<SubmitSessionResponse> {
		const payload = {
			verification: {
				status: SubmitSessionRequestStatus.SUBMITTED,
			},
		};

		const signature = this.generateHmacSignature(payload);
		const headers = this.setCustomHeaders(signature, _headers);

		const endpoint = ApiEndpoints.SUBMIT_DECISION.replace(
			"{sessionId}",
			sessionId,
		);

		const parameters = this.buildParameters(endpoint, payload, headers);
		const response = await this.patch(parameters);
		expect(response.status()).toBe(HttpStatus.OK);
		return response.json() as Promise<SubmitSessionResponse>;
	}

	/**
	 * Creates headers with HMAC signature
	 * @param signature - The HMAC signature to include
	 * @param _headers - Optional additional headers to merge
	 * @returns Headers object with HMAC signature
	 */
	private setCustomHeaders(
		signature: string,
		_headers?: Record<string, string>,
	): Record<string, string> {
		return {
			"X-HMAC-SIGNATURE": signature,
			...(_headers || {}),
		};
	}
}
