import type { Page } from "@playwright/test";
import { BaseNetworkListener } from "./base-listener";
import { ApiEndpoints } from "@enums/api-endpoints";
import { waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { UserAuditLogEntry } from "@dtos/responses/gamdom-api/get-user-audit-log-response";

export class UserAuditLogListener extends BaseNetworkListener {
	constructor(page: Page) {
		super(page);
	}

	protected shouldCaptureResponse(url: string): boolean {
		return url.includes(ApiEndpoints.GET_USER_AUDIT_LOG);
	}

	public async getLatestAuditLog(
		options = {
			intervalSeconds: Timeout.EXTRA_SHORT,
			timeoutSeconds: Timeout.LONG,
			errorMessage: "Timed out while waiting for user audit log response",
		},
	): Promise<UserAuditLogEntry[]> {
		let latestPayload: UserAuditLogEntry[] | undefined;

		await waitUntil(
			async () => {
				if (this.responses.length === 0) {
					return false;
				}

				const payloads = await Promise.all(
					this.responses.map((r) => r.json() as Promise<UserAuditLogEntry[]>),
				);

				latestPayload = payloads.at(-1) ?? undefined;

				return latestPayload !== undefined;
			},
			{
				errorMessage: options.errorMessage,
				intervalSeconds: options.intervalSeconds,
				timeoutSeconds: options.timeoutSeconds,
			},
		);

		if (!latestPayload) {
			throw new Error(
				"Unexpected: no latestPayload after waitUntil succeeded",
			);
		}

		return latestPayload;
	}
}
