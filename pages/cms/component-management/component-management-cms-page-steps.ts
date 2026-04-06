import { BasePageStep } from "@pages/base/base-page-step";
import { ComponentManagementPage } from "./component-management-cms-page";
import { step } from "decorators/step";

export class ComponentManagementSteps extends BasePageStep<ComponentManagementPage> {
	public constructor(page: ComponentManagementPage) {
		super(page);
	}

	@step("Navigate to home tab")
	public async navigateToHomeTab(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.map.homePageTab.click();
	}

	@step("Navigate to casino tab")
	public async navigateToCasinoTab(): Promise<void> {
		await this.gamdomPage.navigateToCasino();
		await this.gamdomPage.map.casinoPageTab.click();
	}

	@step("Navigate to sports tab")
	public async navigateToSportsTab(): Promise<void> {
		await this.gamdomPage.navigateToSports();
		await this.gamdomPage.map.sportsPageTab.click();
	}

	@step("Navigate to providers tab")
	public async navigateToProvidersTab(): Promise<void> {
		await this.gamdomPage.navigateToProviders();
		await this.gamdomPage.map.providersPageTab.click();
	}

	@step("Click edit for component card")
	public async clickEditForCard(title: string): Promise<void> {
		await this.gamdomPage.map.getEditButtonForCard(title).click();
	}
}
