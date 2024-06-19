import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { RewardsPageMap } from "./rewards-page-map";
import { RewardsPageAsserter } from "./rewards-page-asserter";
import { WelcomeBonusModal } from "@modals/promo-code-modal/welcome-bonus-modal";
import { RewardsPageSteps } from "./rewards-page-steps";
import { REWARDS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { RatebackHouseEdge } from "@enums/rateback-house-edge-options";
import { SPECIAL_OFFER_RATEBACK } from "@constants/specialoffers";
import { calculateRakeback } from "@formulas/rakeback";
import { Timeout } from "@enums/timeout";

export class RewardsPage extends BasePage<RewardsPageMap> {
	public constructor(page: Page) {
		super(page, new RewardsPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(REWARDS_PAGE_ENDPOINT);
	}

	public override assertThat(): RewardsPageAsserter {
		return new RewardsPageAsserter(this);
	}

	public steps(): RewardsPageSteps {
		return new RewardsPageSteps(this);
	}

	public get welcomeBonusModal(): WelcomeBonusModal {
		return new WelcomeBonusModal(this.page);
	}

	public async clickActivateNowButton(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.specialOfferActivateNowButton,
			timeout: Timeout.EXTRA_MAX, // To be removed when issues with e2e environment are resolved
		});
		await this.map.specialOfferActivateNowButton.click();
	}

	public async clickInstantRakebackClaimRewardButton(): Promise<void> {
		await this.map.instantRakebackClaimRewardButton.click();
	}

	public async getRakebackAmount(): Promise<string> {
		const amount = await this.map.instatRakebackAmount.textContent();
		if (amount) {
			return amount;
		} else {
			throw new Error("Amount not displayed!");
		}
	}

	public async calculateRatebackAmount(parameters: {
		wager: number;
		rateback: number;
		houseEdge: RatebackHouseEdge;
	}): Promise<number> {
		const { wager, rateback, houseEdge } = parameters;
		let ratebackAmount: number;
		if (await this.map.specialOfferInProgressButton.isVisible()) {
			ratebackAmount = calculateRakeback(
				wager,
				SPECIAL_OFFER_RATEBACK,
				houseEdge,
			);
		} else {
			ratebackAmount = calculateRakeback(wager, rateback, houseEdge);
		}

		return ratebackAmount;
	}
}
