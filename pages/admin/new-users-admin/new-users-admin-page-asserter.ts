import { BaseAsserter } from "@pages/base/base-asserter";
import { NewUsersAdminPage } from "./new-users-admin-page";

export class NewUsersAdminAsserter extends BaseAsserter<NewUsersAdminPage> {
	public constructor(page: NewUsersAdminPage) {
		super(page);
	}
}
