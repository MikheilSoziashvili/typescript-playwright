import { BasePage } from "@base/base-page";
import { REWARDS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { RewardsRoyaltyUpRanksValues } from "@constants/rewards-royalty-up-rank-values";
import { SPECIAL_OFFER_RATEBACK } from "@constants/specialoffers";
import { buildClaimedAmountSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { BasePageNavigationParametersType } from "@core/types/types";
import { RatebackHouseEdge } from "@enums/rateback-house-edge-options";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { Timeout } from "@enums/timeout";
import { calculateRakeback } from "@formulas/rakeback";
import { WelcomeBonusModal } from "@pages/modals/welcome-bonus-modal/welcome-bonus-modal";
import { Toast } from "@pages/components/toast/toast";
import { Page, expect } from "@playwright/test";
import { step } from "decorators/step";
import { RewardsPageAsserter } from "./rewards-page-asserter";
import { RewardsPageMap } from "./rewards-page-map";
import { RewardsPageSteps } from "./rewards-page-steps";
import { RewardType } from "@enums/admin/reward-type";
import { logger } from "@logger/logger";

export class RewardsPage extends BasePage<RewardsPageMap> {
	public constructor(page: Page) {
		super(page, new RewardsPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [REWARDS_PAGE_ENDPOINT] },
		});
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

	@step("Click activate now button")
	public async clickActivateNowButton(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.specialOfferActivateNowButton,
			timeout: Timeout.EXTRA_MAX, // To be removed when issues with e2e environment are resolved
		});
		await this.map.specialOfferActivateNowButton.click();
	}

	@step("Click instant rakeback claim reward button")
	public async clickInstantRakebackClaimRewardButton(): Promise<void> {
		await this.map.instantRakebackClaimRewardButton.click();
	}

	@step("Get rakeback amount")
	public async getRakebackAmount(): Promise<string> {
		const amount = await this.map.instantRakebackAmount.textContent();
		if (amount) {
			return amount;
		} else {
			throw new Error("Amount not displayed!");
		}
	}

	@step("Calculate rakeback amount")
	public async calculateRakebackAmount(parameters: {
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
	@step("Claim royalty up reward")
	async claimRoyaltyUpReward(
		claimRewards: RewardsRoyaltyUpRanks[],
		options?: {
			includePreviousRankReward?: boolean;
			previousRank?: RewardsRoyaltyUpRanks;
		},
	): Promise<void> {
		for (const reward of claimRewards) {
			if (
				reward === RewardsRoyaltyUpRanks.UNRANKED &&
				!(options?.includePreviousRankReward && options.previousRank)
			) {
				logger.info("UNRANKED reward is not claimable");
				continue;
			}

			const rewardKey = reward
				.replace(" ", "_")
				.toUpperCase() as keyof typeof RewardsRoyaltyUpRanksValues;

			let expectedRewardValue = RewardsRoyaltyUpRanksValues[rewardKey];

			if (options?.includePreviousRankReward && options.previousRank) {
				const previousRankKey = options.previousRank
					.replace(" ", "_")
					.toUpperCase() as keyof typeof RewardsRoyaltyUpRanksValues;

				const previousRankValue =
					RewardsRoyaltyUpRanksValues[previousRankKey];

				logger.info(
					`Including previous rank '${options.previousRank}' reward: $${previousRankValue}`,
				);
				expectedRewardValue += previousRankValue;
			}

			await this.map
				.royaltyUpRewardsItem(reward)
				.scrollIntoViewIfNeeded();

			const accountBalanceInitial =
				await this.authenticatedHeader.getAccountBalance();

			await this.map.royaltyUpItemClaimButton(reward).click();

			const toast = new Toast(this.page);
			await toast.assertThat().isDisplayed();
			await toast
				.assertThat()
				.subTitleIs(buildClaimedAmountSubTitle(expectedRewardValue));
			await expect(
				this.map.royaltyUpItemClaimButton(reward),
			).toBeDisabled();

			await this.authenticatedHeader
				.assertThat()
				.accountBalanceIs(accountBalanceInitial + expectedRewardValue);
		}
	}

	@step("Click Activate button for reward")
	async clickOnRewardButton(
		reward: string,
		buttonText: string,
	): Promise<void> {
		await this.map.rewardCardButton(reward, buttonText).click();
	}

	@step("Claim royalty up reward")
	async claimSingleRoyaltyUpReward(): Promise<void> {
		await this.map.royaltyUpClaimButton.click();
	}

	@step("Claim reward")
	async claimReward(rewardType: RewardType): Promise<void> {
		await this.map.getRewardClaimButton(rewardType).click();
	}
}
