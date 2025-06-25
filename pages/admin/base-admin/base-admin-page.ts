import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { BaseAdminAsserter } from "./base-admin-page-asserter";
import { BaseAdminMap } from "./base-admin-page-map";
import { BaseAdminSteps } from "./base-admin-page-steps";
import { ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";

export class BaseAdminPage extends BasePage<BaseAdminMap> {
	public constructor(page: Page) {
		super(page, new BaseAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): BaseAdminAsserter {
		return new BaseAdminAsserter(this);
	}

	public steps(): BaseAdminSteps {
		return new BaseAdminSteps(this);
	}

	@step("Click on admin tab")
	public async clickOnAdminTab(adminTab: string): Promise<void> {
		await this.map.getAdminPageLocator(adminTab).click();
	}
}
