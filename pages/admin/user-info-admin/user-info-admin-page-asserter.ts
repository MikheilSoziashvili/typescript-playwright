import { BaseAsserter } from "base/base-asserter";
import { UserInfoAdminPage } from "./user-info-admin-page";

export class UserInfoAdminPageAsserter extends BaseAsserter<UserInfoAdminPage> {
	public constructor(page: UserInfoAdminPage) {
		super(page);
	}
}
