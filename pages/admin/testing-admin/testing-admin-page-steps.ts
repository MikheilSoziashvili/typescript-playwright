import { BasePageStep } from "@pages/base/base-page-step";
import { TestingAdminPage } from "./testing-admin-page";

export class TestingAdminSteps extends BasePageStep<TestingAdminPage> {
	public constructor(page: TestingAdminPage) {
		super(page);
	}
}
