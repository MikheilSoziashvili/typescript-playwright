import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export class VerifyReloadRewardPresenceTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Verify reload reward presence in section")
	public async verifyReloadRewardPresence(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		section: RewardStatus;
		presence: boolean;
		rewardAmount?: string;
	}): Promise<void> {
		const { adminUser, targetUsername, section, presence, rewardAmount } =
			params;

		await adminUser.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		const asserter = adminUser.pages.userInfoRewardsAdminPage.assertThat();

		if (!presence) {
			await asserter.noActiveRewardsVisible(section);
			return;
		}

		const verifyMethod = rewardAmount
			? asserter.rewardVisibleInSection(
					section,
					CustomRewardType.RELOAD,
					rewardAmount,
				)
			: asserter.rewardVisibleInSectionWithoutValue(
					section,
					CustomRewardType.RELOAD,
				);

		await verifyMethod;
	}

	@testFlow("Verify reload reward is present in section")
	public async verifyReloadRewardIsPresent(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		section: RewardStatus;
		rewardAmount?: string;
	}): Promise<void> {
		await this.verifyReloadRewardPresence({
			...params,
			presence: true,
		});
	}

	@testFlow("Verify reload reward is absent in section")
	public async verifyReloadRewardIsAbsent(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		section: RewardStatus;
	}): Promise<void> {
		await this.verifyReloadRewardPresence({
			...params,
			presence: false,
		});
	}
}
