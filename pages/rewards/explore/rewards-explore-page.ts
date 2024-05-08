import { Page } from "@playwright/test";
import { BasePage } from "base/base-page";
import { RewardsExplorePageMap } from "./rewards-explore-page-map";
import { REWARDS_EXPLORE_PAGE_ENDPOINT } from "constants/page-endpoints";
import { RewardsExplorePageAsserter } from "./rewards-explore-page-asserter";

export class RewardsExplorePage extends BasePage<RewardsExplorePageMap> {
	public constructor(page: Page) {
		super(page, new RewardsExplorePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(REWARDS_EXPLORE_PAGE_ENDPOINT);
	}

	public override assertThat(): RewardsExplorePageAsserter {
		return new RewardsExplorePageAsserter(this);
	}

	public async expandCurrentRoyaltyContainer(): Promise<void> {
		await this.map.currentRoyaltyContainerExpandButton.click();
	}

	public async getCurrentRoyaltyInstantRateback(): Promise<number> {
		const ratebackText =
			await this.map.currentRoyaltyContainerInstantRakebackLocator.textContent();

		if (ratebackText) {
			return Number(ratebackText.replace("%", ""));
		} else {
			throw new Error(
				"No instant rateback text found for current royalty!",
			);
		}
	}
}
