import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoInfoAdminPageMap } from "./user-info-info-admin-page-map";
import { INFO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { UserInfoInfoAdminPageAsserter } from "./user-info-info-admin-page-asserter";
import { UserInfoInfoAdminPageSteps } from "./user-info-info-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";

export class UserInfoInfoAdminPage extends BasePage<UserInfoInfoAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoInfoAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [INFO_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): UserInfoInfoAdminPageAsserter {
		return new UserInfoInfoAdminPageAsserter(this);
	}

	public steps(): UserInfoInfoAdminPageSteps {
		return new UserInfoInfoAdminPageSteps(this);
	}

	public get twoFactorAuthModal(): TwoFactorAuthModal {
		return new TwoFactorAuthModal(this.page);
	}
}
