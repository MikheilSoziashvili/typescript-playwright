import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { NewUsersAdminAsserter } from "./new-users-admin-page-asserter";
import { NewUsersAdminMap } from "./new-users-admin-page-map";
import { NewUsersAdminSteps } from "./new-users-admin-page-steps";

export class NewUsersAdminPage extends BasePage<NewUsersAdminMap> {
	public constructor(page: Page) {
		super(page, new NewUsersAdminMap(page));
	}

	public override assertThat(): NewUsersAdminAsserter {
		return new NewUsersAdminAsserter(this);
	}

	public steps(): NewUsersAdminSteps {
		return new NewUsersAdminSteps(this);
	}
}
