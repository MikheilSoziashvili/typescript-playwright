import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { SeoRedirectsAdminAsserter } from "./seo-redirects-admin-page-asserter";
import { SeoRedirectsAdminMap } from "./seo-redirects-admin-page-map";
import { SeoRedirectsAdminSteps } from "./seo-redirects-admin-page-steps";
import { SEO_REDIRECTS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Toast } from "@pages/components/toast/toast";

export class SeoRedirectsAdminPage extends BasePage<SeoRedirectsAdminMap> {
	public readonly toast: Toast;

	public constructor(page: Page) {
		super(page, new SeoRedirectsAdminMap(page));
		this.toast = new Toast(page);
	}

	public override assertThat(): SeoRedirectsAdminAsserter {
		return new SeoRedirectsAdminAsserter(this);
	}

	public steps(): SeoRedirectsAdminSteps {
		return new SeoRedirectsAdminSteps(this);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SEO_REDIRECTS_PAGE_ENDPOINT] },
		});
	}

	@step("Click new redirect button")
	public async clickNewRedirectButton(): Promise<void> {
		await this.map.newRedirectButton.click();
	}

	@step("Click delete redirect")
	public async clickDeleteRedirect(fromPath: string): Promise<void> {
		await this.map.deleteButtonInRow(fromPath).click();
	}

	@step("Click edit redirect")
	public async clickEditRedirect(fromPath: string): Promise<void> {
		await this.map.editButtonInRow(fromPath).click();
	}

	@step("Open history tab")
	public async openHistoryTab(): Promise<void> {
		await this.map.historyTab.click();
	}
}
