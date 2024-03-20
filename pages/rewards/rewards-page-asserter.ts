import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { RewardsPage } from "./rewards-page";

export class RewardsPageAsserter extends BaseAsserter<RewardsPage> {
	public constructor(page: RewardsPage) {
		super(page);
	}

	async isClaimedBadgeVisible(): Promise<void> {
		// eslint-disable-next-line playwright/prefer-web-first-assertions
		expect(await this.gamdomPage.map.claimedBadge.isVisible()).toBe(true);
	}

	async isPromotionInProgress(): Promise<void> {
		// eslint-disable-next-line playwright/prefer-web-first-assertions
		expect(await this.gamdomPage.map.inProgressButton.isVisible()).toBe(
			true,
		);
	}
}
