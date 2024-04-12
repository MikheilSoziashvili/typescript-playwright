import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { BannedUserPage } from "./banned-user-page";

export class BannedUserPageAsserter extends BaseAsserter<BannedUserPage> {
	public constructor(page: BannedUserPage) {
		super(page);
	}

	public async isBannedTitleDisplayed(): Promise<void> {
		await this.gamdomPage.map.redContainer.waitFor({ state: "visible" });
		await expect(this.gamdomPage.map.restrictionTitle).toHaveText(
			"Your account has been Banned!",
		);
	}

	public async isBannedReasonDisplayed(reason?: string): Promise<void> {
		await this.gamdomPage.map.redContainer.waitFor({ state: "visible" });
		const bannedReason = reason || "Banned";
		await expect(this.gamdomPage.map.bannedReason).toHaveText(
			`Reason: ${bannedReason}`,
		);
	}
}
