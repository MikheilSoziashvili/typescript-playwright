import { BasePageStep } from "@pages/base/base-page-step";
import { SeoRedirectsAdminPage } from "./seo-redirects-admin-page";
import { step } from "decorators/step";

export class SeoRedirectsAdminSteps extends BasePageStep<SeoRedirectsAdminPage> {
	public constructor(page: SeoRedirectsAdminPage) {
		super(page);
	}

	@step("Delete redirect and assert toast")
	public async deleteRedirectAndAssertToast(fromPath: string): Promise<void> {
		await this.gamdomPage.clickDeleteRedirect(fromPath);
		await this.gamdomPage
			.assertThat()
			.redirectDeletedSuccessToastIsDispayed(fromPath);
	}

	@step("Open history tab and verify from and to paths edit history")
	public async openHistoryAndVerifyEdit(
		fromPathBefore: string,
		fromPathAfter: string,
		toPathBefore: string,
		toPathAfter: string,
	): Promise<void> {
		await this.gamdomPage.openHistoryTab();
		await this.gamdomPage
			.assertThat()
			.verifyHistoryEdit(
				fromPathBefore,
				fromPathAfter,
				toPathBefore,
				toPathAfter,
			);
	}
}
