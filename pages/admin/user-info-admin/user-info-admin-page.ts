import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoAdminPageMap } from "./user-info-admin-page-map";
import { UserInfoAdminPageAsserter } from "./user-info-admin-page-asserter";
import { UserInfoAdminPageSteps } from "./user-info-admin-page-steps";
import { USER_INFO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class UserInfoAdminPage extends BasePage<UserInfoAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [USER_INFO_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): UserInfoAdminPageAsserter {
		return new UserInfoAdminPageAsserter(this);
	}

	public steps(): UserInfoAdminPageSteps {
		return new UserInfoAdminPageSteps(this);
	}

	public async clickSearchByUsernameField(): Promise<void> {
		await this.map.searchByUsernameContainer.click();
	}

	public async insertUsernameInSearchByUsernameInput(
		username: string,
	): Promise<void> {
		await this.map.searchByUsernameInput.fill(username);
	}

	public async selectUsernameFromSearchForUsernameFiledResults(
		username: string,
	): Promise<void> {
		await this.map.searchByUsernameMenuOption(username).click();
	}
}
