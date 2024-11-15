import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { MaintenancePageMap } from "./maintenance-page-map";
import { MaintenancePageAsserter } from "./maintenance-page-asserter";

export class MaintenancePage extends BasePage<MaintenancePageMap> {
	public constructor(page: Page) {
		super(page, new MaintenancePageMap(page));
	}

	public async navigateMaintenancePage(
		maintenancePageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [maintenancePageEndpoint] },
		});
	}

	public async navigateToPage(
		maintenancePageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [maintenancePageEndpoint] },
		});
	}

	public override assertThat(): MaintenancePageAsserter {
		return new MaintenancePageAsserter(this);
	}

	@step()
	public async openSocialMediaFooterLinkByPlaceholder(
		footerLink: string,
	): Promise<void> {
		await this.map.socialMediaFooterLinkByPlaceholder(footerLink).click();
	}
}
