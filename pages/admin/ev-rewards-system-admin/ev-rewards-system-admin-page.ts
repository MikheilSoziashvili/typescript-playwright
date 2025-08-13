import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { EvRewardsSystemAdminAsserter } from "./ev-rewards-system-admin-page-asserter";
import { EvRewardsSystemAdminMap } from "./ev-rewards-system-admin-page-map";
import { EvRewardsSystemAdminSteps } from "./ev-rewards-system-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { EV_REWARDS_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class EvRewardsSystemAdminPage extends BasePage<EvRewardsSystemAdminMap> {
	public constructor(page: Page) {
		super(page, new EvRewardsSystemAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [EV_REWARDS_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): EvRewardsSystemAdminAsserter {
		return new EvRewardsSystemAdminAsserter(this);
	}

	public steps(): EvRewardsSystemAdminSteps {
		return new EvRewardsSystemAdminSteps(this);
	}
}
