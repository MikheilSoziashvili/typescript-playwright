import { expect, APIResponse } from "@playwright/test";
import { step } from "decorators/step";

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
}
