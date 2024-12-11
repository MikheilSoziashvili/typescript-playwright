import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CommunityConnectAdminAsserter } from "./community-connect-admin-page-asserter";
import { CommunityConnectAdminMap } from "./community-connect-admin-page-map";
import { CommunityConnectAdminSteps } from "./community-connect-admin-page-steps";

export class CommunityConnectAdminPage extends BasePage<CommunityConnectAdminMap> {
	public constructor(page: Page) {
		super(page, new CommunityConnectAdminMap(page));
	}

	public override assertThat(): CommunityConnectAdminAsserter {
		return new CommunityConnectAdminAsserter(this);
	}

	public steps(): CommunityConnectAdminSteps {
		return new CommunityConnectAdminSteps(this);
	}
}
