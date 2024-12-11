import { BaseAsserter } from "@pages/base/base-asserter";
import { TestingAdminPage } from "./testing-admin-page";

export class TestingAdminAsserter extends BaseAsserter<TestingAdminPage> {
	public constructor(page: TestingAdminPage) {
		super(page);
	}
}
