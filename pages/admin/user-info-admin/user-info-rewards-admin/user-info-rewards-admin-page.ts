import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { UserInfoRewardsAdminPageAsserter } from "./user-info-rewards-admin-page-asserter";
import { UserInfoRewardsAdminPageMap } from "./user-info-rewards-admin-page-map";
import { UserInfoRewardsAdminPageSteps } from "./user-info-rewards-admin-page-steps";
import { step } from "decorators/step";
import { CustomRewardType } from "@enums/admin/custom-reward-type";

export class UserInfoRewardsAdminPage extends BasePage<UserInfoRewardsAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoRewardsAdminPageMap(page));
	}

	public override assertThat(): UserInfoRewardsAdminPageAsserter {
		return new UserInfoRewardsAdminPageAsserter(this);
	}

	public steps(): UserInfoRewardsAdminPageSteps {
		return new UserInfoRewardsAdminPageSteps(this);
	}

	@step("Click on the New Custom Reward button")
	public async clickNewCustomRewardButton(): Promise<void> {
		await this.map.newCustomRewardButton.click();
	}

	@step("Select reward type")
	public async selectRewardType(reward: string): Promise<void> {
		await this.map.rewardTypeDropdown.click();
		await this.map.selectRewardType(reward).click();
	}

	@step("Set XP Challenge EV Required")
	public async setXPChallengeEvRequired(ev: number): Promise<void> {
		await this.map.xpChallengeEvRequiredInput.fill(ev.toString());
	}

	@step("Click on Set Reward button")
	public async clickSetRewardButton(): Promise<void> {
		await this.map.setRewardButton.click();
	}

	@step("Set XP Challenge Challenge Duration")
	public async setXPChallengeChallengeDuration(days: number): Promise<void> {
		await this.map.xpChallengeChallengeDurationInput.fill(days.toString());
	}

	@step("Set reward amount")
	public async setRewardAmount(amount: number): Promise<void> {
		await this.map.setRewardAmountInput.fill(amount.toString());
	}

	@step(
		"Set custom xp_challange reward with challenge duration, ev required and reward amount",
	)
	public async setCustomXpChallengeReward(
		evRequired: number,
		challengeDuration: number,
		rewardAmount: number,
	): Promise<void> {
		this.acceptDialog();
		await this.clickNewCustomRewardButton();
		await this.selectRewardType(CustomRewardType.XP_CHALLENGE);
		await this.setXPChallengeEvRequired(evRequired);
		await this.setXPChallengeChallengeDuration(challengeDuration);
		await this.setRewardAmount(rewardAmount);
		await this.clickSetRewardButton();
	}

	@step("Click on Change reward button")
	public async clickChangeRewardButton(
		section: string,
		reward: string,
	): Promise<void> {
		await this.map.changeRewardButton(section, reward).click();
	}

	@step("Set reward total")
	public async setRewardTotal(total: number): Promise<void> {
		await this.map.rewardTotalInput.fill(total.toString());
	}

	@step("Click on Save Changes button")
	public async clickSaveChangesButton(): Promise<void> {
		await this.map.saveChangesButton.click();
	}
}
