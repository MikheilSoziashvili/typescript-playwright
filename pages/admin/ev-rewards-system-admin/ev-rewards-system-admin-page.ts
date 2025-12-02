import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { EvRewardsSystemAdminAsserter } from "./ev-rewards-system-admin-page-asserter";
import { EvRewardsSystemAdminMap } from "./ev-rewards-system-admin-page-map";
import { EvRewardsSystemAdminSteps } from "./ev-rewards-system-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { EV_REWARDS_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { step } from "decorators/step";
import { Datepicker } from "@pages/components/datepicker/datepicker";

export class EvRewardsSystemAdminPage extends BasePage<EvRewardsSystemAdminMap> {
	public datepicker: Datepicker;
	public constructor(page: Page) {
		super(page, new EvRewardsSystemAdminMap(page));
		this.datepicker = new Datepicker(page);
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

	@step("Bulk reward file upload")
	public async bulkRewardFileUpload(filePath: string): Promise<void> {
		await this.map.inputBulkRewardFile.setInputFiles(filePath);
	}

	@step("Click reward users button")
	public async clickRewardUsersButton(): Promise<void> {
		await this.map.rewardUsersButton.click();
	}
}
