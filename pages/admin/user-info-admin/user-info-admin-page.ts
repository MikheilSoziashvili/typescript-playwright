import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoAdminPageMap } from "./user-info-admin-page-map";
import { UserInfoAdminPageAsserter } from "./user-info-admin-page-asserter";
import { UserInfoAdminPageSteps } from "./user-info-admin-page-steps";
import { USER_INFO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class UserInfoAdminPage extends BasePage<UserInfoAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoAdminPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(USER_INFO_ADMIN_PAGE_ENDPOINT);
	}

	public override assertThat(): UserInfoAdminPageAsserter {
		return new UserInfoAdminPageAsserter(this);
	}

	public steps(): UserInfoAdminPageSteps {
		return new UserInfoAdminPageSteps(this);
	}
}
