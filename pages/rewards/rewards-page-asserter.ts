import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { RewardsPage } from "./rewards-page";
import { DEFAULT_CURRENCY } from "@constants/defaults";
import { parseToFloat } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";

export class RewardsPageAsserter extends BaseAsserter<RewardsPage> {
	public constructor(page: RewardsPage) {
		super(page);
	}

	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.rewardsBlock,
				this.gamdomPage.map.royaltyUpBlock,
			],
			Timeout.MAX,
		);
	}

	async isSpecialOfferActivateButtonDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferActivateNowButton,
		).toBeDisabled({
			timeout: Timeout.EXTRA_LONG, // To be removed when issues with e2e environment are resolved
		});
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
		amount: number,
		currency?: string,
	): Promise<void> {
		const amountCurrency = currency ?? DEFAULT_CURRENCY;
		await expect(this.gamdomPage.map.instatRakebackAmount).toHaveText(
			`${amountCurrency}${parseToFloat(amount)}`,
		);
	}
}
