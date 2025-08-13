import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { UserInfoRewardsHistoryAdminPageAsserter } from "./user-info-rewards-history-admin-asserter";
import { UserInfoRewardsHistoryAdminPageMap } from "./user-info-rewards-history-admin-map";
import { UserInfoRewardsHistoryAdminPageSteps } from "./user-info-rewards-history-admin-steps";

export class UserInfoRewardsHistoryAdminPage extends BasePage<UserInfoRewardsHistoryAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoRewardsHistoryAdminPageMap(page));
	}

	public override assertThat(): UserInfoRewardsHistoryAdminPageAsserter {
		return new UserInfoRewardsHistoryAdminPageAsserter(this);
	}

	public steps(): UserInfoRewardsHistoryAdminPageSteps {
		return new UserInfoRewardsHistoryAdminPageSteps(this);
	}
}
