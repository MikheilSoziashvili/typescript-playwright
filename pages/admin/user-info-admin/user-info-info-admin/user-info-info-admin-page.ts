import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoInfoAdminPageMap } from "./user-info-info-admin-page-map";
import { INFO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { UserInfoInfoAdminPageAsserter } from "./user-info-info-admin-page-asserter";
import { UserInfoInfoAdminPageSteps } from "./user-info-info-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";
import { Toast } from "@pages/components/toast/toast";
import { step } from "decorators/step";
import { Delay } from "@enums/delay";
import { BanCategories } from "@enums/admin/ban-categories";

export class UserInfoInfoAdminPage extends BasePage<UserInfoInfoAdminPageMap> {
	public readonly toast: Toast;

	public constructor(page: Page) {
		super(page, new UserInfoInfoAdminPageMap(page));
		this.toast = new Toast(page);
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

	@step("Fill notification title")
	public async fillNotificationTitle(title: string): Promise<void> {
		await this.map.sendNotificationTitleInput.pressSequentially(title, {
			delay: Delay.MAX_SHORT,
		});
	}

	@step("Fill notification description")
	public async fillNotificationDescription(
		description: string,
	): Promise<void> {
		await this.map.sendNotificationDescriptionInput.pressSequentially(
			description,
			{ delay: Delay.MAX_SHORT },
		);
	}

	@step("Fill notification reason")
	public async fillNotificationReason(reason: string): Promise<void> {
		await this.map.sendNotificationReasonInput.pressSequentially(reason, {
			delay: Delay.MAX_SHORT,
		});
	}

	@step("Click send notification button")
	public async clickSendNotificationButton(): Promise<void> {
		await this.map.sendNotificationButton.click();
	}

	@step("Click ban user button")
	public async clickBanUserButton(): Promise<void> {
		await this.map.banUserButton.click();
	}

	@step("Toggle ban category options")
	public async toggleBanCategoryOptions(
		category: BanCategories,
	): Promise<void> {
		await this.map.getBanCategoryOption(category).click();
	}
}
