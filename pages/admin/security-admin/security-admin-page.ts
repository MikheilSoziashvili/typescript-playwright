import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { SecurityAdminPageMap } from "./security-admin-page-map";
import { SECURITY_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { SecurityAdminPageAsserter } from "./security-admin-page-asserter";
import { Toast } from "@pages/components/toast/toast";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";

export class SecurityAdminPage extends BasePage<SecurityAdminPageMap> {
	public constructor(page: Page) {
		super(page, new SecurityAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SECURITY_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): SecurityAdminPageAsserter {
		return new SecurityAdminPageAsserter(this);
	}

	public async updateUserWithdrawLimits(
		alertLimit: number,
		blockLimit: number,
	): Promise<void> {
		await this.map.alertUserInput.fill(alertLimit.toString());
		await this.map.blockUserInput.fill(blockLimit.toString());
		await this.map.saveButton.click();

		// Below assertion to be revised. Potential refactoring in steps constructor might be required.
		const toast = new Toast(this.page);
		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: ToastSubTitle.SETTINGS_UPDATED,
		});
	}
}
