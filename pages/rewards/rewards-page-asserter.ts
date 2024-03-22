import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { RewardsPage } from "./rewards-page";

export class RewardsPageAsserter extends BaseAsserter<RewardsPage> {
	public constructor(page: RewardsPage) {
		super(page);
	}

	async isClaimedBadgeVisible(): Promise<void> {
		await expect(this.gamdomPage.map.claimedBadge).toBeVisible();
	}

	async isPromotionInProgress(): Promise<void> {
		await expect(this.gamdomPage.map.inProgressButton).toBeVisible();
	}
}
