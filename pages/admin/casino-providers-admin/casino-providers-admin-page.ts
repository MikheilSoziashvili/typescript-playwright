import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CasinoProvidersAdminAsserter } from "./casino-providers-admin-page-asserter";
import { CasinoProvidersAdminMap } from "./casino-providers-admin-page-map";
import { CasinoProvidersAdminSteps } from "./casino-providers-admin-page-steps";

export class CasinoProvidersAdminPage extends BasePage<CasinoProvidersAdminMap> {
	public constructor(page: Page) {
		super(page, new CasinoProvidersAdminMap(page));
	}

	public override assertThat(): CasinoProvidersAdminAsserter {
		return new CasinoProvidersAdminAsserter(this);
	}

	public steps(): CasinoProvidersAdminSteps {
		return new CasinoProvidersAdminSteps(this);
	}
}
