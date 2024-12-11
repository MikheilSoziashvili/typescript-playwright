import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { TestingAdminAsserter } from "./testing-admin-page-asserter";
import { TestingAdminMap } from "./testing-admin-page-map";
import { TestingAdminSteps } from "./testing-admin-page-steps";

export class TestingAdminPage extends BasePage<TestingAdminMap> {
	public constructor(page: Page) {
		super(page, new TestingAdminMap(page));
	}

	public override assertThat(): TestingAdminAsserter {
		return new TestingAdminAsserter(this);
	}

	public steps(): TestingAdminSteps {
		return new TestingAdminSteps(this);
	}
}
