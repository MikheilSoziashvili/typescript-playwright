import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { RewardsPage } from "./rewards-page";

export class RewardsPageAsserter extends BaseAsserter<RewardsPage> {
	public constructor(page: RewardsPage) {
		super(page);
	}

	async isSpecialOfferClaimedBadgeVisible(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferClaimedBadge,
		).toBeVisible();
	}

	async isSpecialOfferPromotionInProgress(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferInProgressButton,
		).toBeVisible();
	}

	async isSpecialOfferPromotionNotInPrgress(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferInProgressButton,
		).toBeHidden();
	}

	async isInstantRakebackLockedButtonVisibile(): Promise<void> {
		await expect(
			this.gamdomPage.map.instantRakebackLockedButton,
		).toBeVisible();
	}

	async isInstantRakebackLockedButtonDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.instantRakebackLockedButton,
		).toBeDisabled();
	}

	async isInstantRakebackAmountVisible(
		amount: string,
		currency?: string,
	): Promise<void> {
		const amountCurrency = currency ?? "$";
		await expect
			.soft(this.gamdomPage.map.instatRakebackAmount)
			.toHaveText(`${amountCurrency}${amount}`);
	}
}
