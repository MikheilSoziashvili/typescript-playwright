import { BaseAsserter } from "@pages/base/base-asserter";
import { SeoRedirectsAdminPage } from "./seo-redirects-admin-page";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { buildDeletedRedirectFromSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { ToastTitle } from "@enums/toast-titles";

export class SeoRedirectsAdminAsserter extends BaseAsserter<SeoRedirectsAdminPage> {
	public constructor(page: SeoRedirectsAdminPage) {
		super(page);
	}

	@step("Verify a redirect is visible matched by fromPath")
	public async verifyRedirectIsVisible(fromPath: string): Promise<void> {
		const row = this.gamdomPage.map.rowByFromPath(fromPath);

		await expect(row).toBeVisible();
	}

	@step("Redirect deleted Success toast is displayed")
	public async redirectDeletedSuccessToastIsDispayed(
		redirectFrom: string,
	): Promise<void> {
		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await this.gamdomPage.toast
			.assertThat()
			.subTitleIs(buildDeletedRedirectFromSubTitle(redirectFrom));
	}

	@step(
		"Verify an edit in a redirect's history comparing states of paths before and after",
	)
	public async verifyHistoryEdit(
		fromPathBefore: string,
		fromPathAfter: string,
		toPathBefore: string,
		toPathAfter: string,
	): Promise<void> {
		const expectedText = `From path: "${fromPathBefore}" -> "${fromPathAfter}" To path: "${toPathBefore}" -> "${toPathAfter}"`;

		await expect(
			this.gamdomPage.map.historyChangeRow(expectedText),
		).toBeVisible();
	}
}
