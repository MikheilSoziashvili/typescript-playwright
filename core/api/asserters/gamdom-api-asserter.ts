import { expect, APIResponse, Response as PWResponse } from "@playwright/test";
import { step } from "decorators/step";
import { HttpStatus } from "@enums/http-status";

export class GamdomApiAsserter {
	@step("Assert public redirect response")
	public async assertPublicRedirect(
		response: APIResponse,
		expectedStatus: number,
		expectedLocation: string,
	): Promise<void> {
		expect(
			response.status(),
			`Expected status ${expectedStatus} for redirect`,
		).toBe(expectedStatus);

		const location = response.headers()["location"];
		expect(
			location,
			`Expected redirect location header to be ${expectedLocation}`,
		).toBe(expectedLocation);
	}

	@step("Assert response status is {expectedStatus}")
	public async assertResponseStatus(
		response: PWResponse,
		expectedStatus: number = HttpStatus.OK,
	): Promise<void> {
		const url = response.url();
		expect(
			response.status(),
			`Expected status ${expectedStatus} for request: ${url}`,
		).toBe(expectedStatus);
	}
}
