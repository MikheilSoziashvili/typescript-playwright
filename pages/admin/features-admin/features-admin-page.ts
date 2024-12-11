import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { FeaturesAdminAsserter } from "./features-admin-page-asserter";
import { FeaturesAdminMap } from "./features-admin-page-map";
import { FeaturesAdminSteps } from "./features-admin-page-steps";

export class FeaturesAdminPage extends BasePage<FeaturesAdminMap> {
	public constructor(page: Page) {
		super(page, new FeaturesAdminMap(page));
	}

	public override assertThat(): FeaturesAdminAsserter {
		return new FeaturesAdminAsserter(this);
	}

	public steps(): FeaturesAdminSteps {
		return new FeaturesAdminSteps(this);
	}
}
