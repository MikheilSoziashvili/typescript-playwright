import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { ModTipAdminAsserter } from "./mod-tip-admin-page-asserter";
import { ModTipAdminMap } from "./mod-tip-admin-page-map";
import { ModTipAdminSteps } from "./mod-tip-admin-page-steps";

export class ModTipAdminPage extends BasePage<ModTipAdminMap> {
	public constructor(page: Page) {
		super(page, new ModTipAdminMap(page));
	}

	public override assertThat(): ModTipAdminAsserter {
		return new ModTipAdminAsserter(this);
	}

	public steps(): ModTipAdminSteps {
		return new ModTipAdminSteps(this);
	}
}
