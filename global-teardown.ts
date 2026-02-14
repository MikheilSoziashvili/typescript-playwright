import { AUTH_PATH } from "@constants/file-paths";
import { clearDirectoryContent, getCookieHeader } from "@core/utils/utils";
import { GamdomApi } from "@api/gamdom-api";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { Feature } from "@enums/feature";
import { ALL_USER_TYPES_DISABLED } from "@constants/feature-configurations";
import * as Configuration from "configuration";
import { expect } from "@playwright/test";
import { HttpStatus } from "@enums/http-status";
import { writeFileSync } from "fs";

async function globalTeardown(): Promise<void> {
	if (Configuration.enableNewDesignV4Feature) {
		const gamdomApi = new GamdomApi();
		const cookie = getCookieHeader(
			await gamdomApi.authenticateWithExistingUser(
				SUPER_ADMIN_CREDENTIALS.username,
				SUPER_ADMIN_CREDENTIALS.password,
			),
		);

		const responses = await gamdomApi.setFeatureState(
			Feature.NEW_DESIGN_V4,
			ALL_USER_TYPES_DISABLED,
			{ Cookie: cookie },
		);

		responses.forEach((response) => {
			expect(response.status()).toBe(HttpStatus.OK);
		});
	}

	await clearDirectoryContent(AUTH_PATH, ["auth.json"]);

	if (process.env.RP_LAUNCH_UUID) {
		writeFileSync(".rp-launch-uuid", process.env.RP_LAUNCH_UUID);
		process.env.RP_LAUNCH_ID = process.env.RP_LAUNCH_UUID;
	}
}

export default globalTeardown;
