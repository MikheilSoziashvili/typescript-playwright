import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { UserInfoRewardsAdminPageAsserter } from "./user-info-rewards-admin-page-asserter";
import { UserInfoRewardsAdminPageMap } from "./user-info-rewards-admin-page-map";
import { UserInfoRewardsAdminPageSteps } from "./user-info-rewards-admin-page-steps";
import { step } from "decorators/step";

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
}
