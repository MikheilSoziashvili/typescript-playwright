import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { RewardsPageMap } from "./rewards-page-map";
import { RewardsPageAsserter } from "./rewards-page-asserter";
import { WelcomeBonusModal } from "../modals/promo-code-modal/welcome-bonus-modal";
import { RewardsPageSteps } from "./rewards-page-steps";
import { REWARDS_PAGE_ENDPOINT } from "../../constants/page-endpoints";
import { RatebackHouseEdge } from "../../enums/rateback-house-edge-options";
import { SPECIAL_OFFER_RATEBACK } from "../../constants/specialoffers";

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
		await this.map.specialOfferActivateNowButton.click();
	}

	public async clickInstantRakebackClaimRewardButton(): Promise<void> {
		await this.map.instantRakebackClaimRewardButton.click();
	}

	public async calculateRatebackAmount(parameters: {
		wager: string;
		rateback: string;
		houseEdge: RatebackHouseEdge;
	}): Promise<string> {
		const { wager, rateback, houseEdge } = parameters;
		let ratebackAmount: number;
		if (await this.map.specialOfferInProgressButton.isVisible()) {
			ratebackAmount =
				parseFloat(wager) *
				(SPECIAL_OFFER_RATEBACK / 100) *
				(houseEdge / 100);
		} else {
			ratebackAmount =
				parseFloat(wager) *
				(parseFloat(rateback) / 100) *
				(houseEdge / 100);
		}

		return ratebackAmount.toString();
	}
}
