import { BaseAsserter } from "@base/base-asserter";
import { EsportsSidebarSection } from "@enums/esports-sidebar-sections";
import { ExpansionState } from "@enums/expansion-state";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { EsportsPage } from "./esports-page";

export class EsportsPageAsserter extends BaseAsserter<EsportsPage> {
	public constructor(page: EsportsPage) {
		super(page);
	}

	@step("Check page elements are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.esportsButton,
			this.gamdomPage.map.featuredMatchesTitle,
			this.gamdomPage.map.liveMatchesTitle,
		]);
	}

	@step("Verify sidebar section '{sectionName}' is {expectedState}")
	public async verifySidebarSectionState(
		sectionName: EsportsSidebarSection,
		expectedState: ExpansionState,
	): Promise<void> {
		const header = this.gamdomPage.map.sidebarSectionHeader(sectionName);
		const isExpanded = expectedState === ExpansionState.EXPANDED;

		if (isExpanded) {
			await expect(header).toHaveAttribute(
				Attributes.ARIA_EXPANDED,
				BooleanValueString.TRUE,
			);
		} else {
			await expect(header).not.toHaveAttribute(
				Attributes.ARIA_EXPANDED,
				BooleanValueString.TRUE,
			);
		}
	}

	@step("Verify sidebar section is expanded: {sectionName}")
	public async sidebarSectionIsExpanded(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.verifySidebarSectionState(
			sectionName,
			ExpansionState.EXPANDED,
		);
	}

	@step("Verify sidebar section is collapsed: {sectionName}")
	public async sidebarSectionIsCollapsed(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.verifySidebarSectionState(
			sectionName,
			ExpansionState.COLLAPSED,
		);
	}

	@step("Verify sidebar section item is visible: {sectionName} -> {itemName}")
	public async sidebarSectionItemIsVisible(
		sectionName: EsportsSidebarSection,
		itemName: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.sidebarSectionItem(sectionName, itemName),
		]);
	}

	@step("Verify sidebar section exists: {sectionName}")
	public async sidebarSectionExists(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.sidebarSectionHeader(sectionName),
		]);
	}
}
