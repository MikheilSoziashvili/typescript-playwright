import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { EsportsPage } from "./esports-page";
import { EsportsSidebarSection } from "@enums/esports-sidebar-sections";

export class EsportsPageSteps extends BasePageStep<EsportsPage> {
	public constructor(page: EsportsPage) {
		super(page);
	}

	@step("Expand sidebar section successfully: {sectionName}")
	public async expandSidebarSectionSuccessfully(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.gamdomPage.expandSidebarSection(sectionName);
		await this.gamdomPage
			.assertThat()
			.sidebarSectionIsExpanded(sectionName);
	}

	@step("Collapse sidebar section successfully: {sectionName}")
	public async collapseSidebarSectionSuccessfully(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.gamdomPage.collapseSidebarSection(sectionName);
		await this.gamdomPage
			.assertThat()
			.sidebarSectionIsCollapsed(sectionName);
	}

	@step(
		"Click sidebar section item successfully: {sectionName} -> {itemName}",
	)
	public async clickSidebarSectionItemSuccessfully(
		sectionName: EsportsSidebarSection,
		itemName: string,
	): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.sidebarSectionItemIsVisible(sectionName, itemName);
		await this.gamdomPage.clickSidebarSectionItem(sectionName, itemName);
	}
}
