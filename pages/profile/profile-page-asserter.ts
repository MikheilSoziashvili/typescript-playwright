import { BaseAsserter } from "base/base-asserter";
import { ProfilePage } from "./profile-page";

export class ProfilePageAsserter extends BaseAsserter<ProfilePage> {
	public constructor(page: ProfilePage) {
		super(page);
	}
}
