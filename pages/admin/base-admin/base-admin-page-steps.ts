import { BasePageStep } from "@pages/base/base-page-step";
import { BaseAdminPage } from "./base-admin-page";
import * as Configuration from "../../../configuration";
import { step } from "decorators/step";

export class BaseAdminSteps extends BasePageStep<BaseAdminPage> {
	public constructor(page: BaseAdminPage) {
		super(page);
	}

	@step(`Navigate to the given admin tab and assert url and given element`)
	public async navigateAndAssertTab(
		baseAdminPage: BaseAdminPage,
		tab: string,
		endpoint: string,
	): Promise<void> {
		await baseAdminPage.navigate();
		await baseAdminPage.clickOnAdminTab(tab);
		await baseAdminPage
			.assertThat()
			.verifyCurrentUrlIs(Configuration.environment_url + endpoint);
	}
}
