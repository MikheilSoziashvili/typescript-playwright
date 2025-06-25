import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BasePage } from "@base/base-page";
import { RewardsExplorePageMap } from "./rewards-explore-page-map";
import { REWARDS_EXPLORE_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { RewardsExplorePageAsserter } from "./rewards-explore-page-asserter";
import { BasePageNavigationParametersType } from "@core/types/types";

export class RewardsExplorePage extends BasePage<RewardsExplorePageMap> {
	public constructor(page: Page) {
		super(page, new RewardsExplorePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [REWARDS_EXPLORE_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): RewardsExplorePageAsserter {
		return new RewardsExplorePageAsserter(this);
	}

	@step("Expand current royalty container")
	public async expandCurrentRoyaltyContainer(): Promise<void> {
		await this.map.currentRoyaltyContainerExpandButton.click();
	}

	@step("Get current royalty instant rakeback")
	public async getCurrentRoyaltyInstantRakeback(): Promise<number> {
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
