import { BaseAsserter } from "@pages/base/base-asserter";
import { ComponentManagementPage } from "./component-management-cms-page";
import { step } from "decorators/step";

export class ComponentManagementAsserter extends BaseAsserter<ComponentManagementPage> {
	public constructor(page: ComponentManagementPage) {
		super(page);
	}

	@step("Verify component management tabs are visible")
	public async tabsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.homePageTab,
			this.gamdomPage.map.casinoPageTab,
			this.gamdomPage.map.sportsPageTab,
			this.gamdomPage.map.providersPageTab,
		]);
	}

	@step("Verify component card is visible")
	public async componentCardIsVisible(title: string): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.getComponentCard(title)]);
	}

	@step("Verify no results message is displayed")
	public async noResultsIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.noResultsMessage]);
	}
}
