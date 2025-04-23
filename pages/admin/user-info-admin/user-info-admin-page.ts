import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoAdminPageMap } from "./user-info-admin-page-map";
import { UserInfoAdminPageAsserter } from "./user-info-admin-page-asserter";
import { UserInfoAdminPageSteps } from "./user-info-admin-page-steps";
import { USER_INFO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Timeout } from "@enums/timeout";

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
		await this.map.waitForVisibility({
			locator: this.map.searchByUsernameContainer,
			timeout: Timeout.MEDIUM,
		});
		// Due to Webkit failures (unable to click on elements) explicit wait + force click is required
		// eslint-disable-next-line playwright/no-force-option
		await this.map.searchByUsernameContainer.click({ force: true });
	}

	public async clickSearchByIPField(): Promise<void> {
		await this.map.searchByIPInput.click();
	}

	public async insertUsernameInSearchByUsernameInput(
		username: string,
	): Promise<void> {
		await this.map.searchByUsernameInput.fill(username);
	}

	public async selectUsernameFromSearchForUsernameFiledResults(
		username: string,
	): Promise<void> {
		const usernameOption = this.map.searchByUsernameMenuOption(username);
		await this.map.waitForVisibility({
			locator: usernameOption,
			timeout: Timeout.MEDIUM,
		});
		// Due to Webkit failures (unable to click on elements) explicit wait + force click is required
		// eslint-disable-next-line playwright/no-force-option
		await usernameOption.click({ force: true });
	}

	public async insertIPInSearchByIPInput(ipAddress: string): Promise<void> {
		await this.map.searchByIPInput.fill(ipAddress);
	}

	public async searchForIP(ipAddress: string): Promise<void> {
		await this.insertIPInSearchByIPInput(ipAddress);
		await this.map.waitForVisibility({
			locator: this.map.searchIPAddressButton,
			timeout: Timeout.MEDIUM,
		});
		// Due to Webkit failures (unable to click on elements) explicit wait + force click is required
		// eslint-disable-next-line playwright/no-force-option
		await this.map.searchIPAddressButton.click({ force: true });
	}
}
