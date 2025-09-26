import { BaseAsserter } from "@base/base-asserter";
import { UserInfoRewardsAdminPage } from "./user-info-rewards-admin-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";

export class UserInfoRewardsAdminPageAsserter extends BaseAsserter<UserInfoRewardsAdminPage> {
	public constructor(page: UserInfoRewardsAdminPage) {
		super(page);
	}

	@step("New Custom Reward button is visible")
	public async newCustomRewardButtonVisible(): Promise<void> {
		await expect(this.gamdomPage.map.newCustomRewardButton).toBeVisible();
	}

	@step("Reward is visible in section {section}")
	public async rewardVisibleInSection(
		section: string,
		reward: string,
		value: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.tileWithHeadingAndValue(section, reward, value),
		]);
	}

	@step("Reward is visible in section {section} without value")
	public async rewardVisibleInSectionWithoutValue(
		section: string,
		reward: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.tileWithHeading(section, reward),
		]);
	}

	@step("No active rewards are visible in section {section}")
	public async noActiveRewardsVisible(section: string): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map
				.pendingRewardsSection(section)
				.locator("p", { hasText: "No active rewards" }),
		]);
	}
}
