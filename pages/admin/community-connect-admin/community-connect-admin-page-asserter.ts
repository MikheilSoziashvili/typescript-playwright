import { BaseAsserter } from "@pages/base/base-asserter";
import { CommunityConnectAdminPage } from "./community-connect-admin-page";

export class CommunityConnectAdminAsserter extends BaseAsserter<CommunityConnectAdminPage> {
	public constructor(page: CommunityConnectAdminPage) {
		super(page);
	}
}
