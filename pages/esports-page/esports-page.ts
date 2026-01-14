import { Page, Response as PWResponse } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { EsportsPageMap } from "./esports-page-map";
import { ESPORTS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { EsportsPageAsserter } from "./esports-page-asserter";
import { EsportsPageSteps } from "./esports-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { logger } from "@logger/logger";
import { GamdomApiAsserter } from "@core/api/asserters/gamdom-api-asserter";
import { ApiEndpoints } from "@enums/api-endpoints";
import { EsportsSidebarSection } from "@enums/esports-sidebar-sections";
import { ExpansionState } from "@enums/expansion-state";

export class EsportsPage extends BasePage<EsportsPageMap> {
	private apiAsserter: GamdomApiAsserter;

	public constructor(page: Page) {
		super(page, new EsportsPageMap(page));
		this.apiAsserter = new GamdomApiAsserter();
	}

	public override assertThat(): EsportsPageAsserter {
		return new EsportsPageAsserter(this);
	}

	public steps(): EsportsPageSteps {
		return new EsportsPageSteps(this);
	}

	public getApiAsserter(): GamdomApiAsserter {
		return this.apiAsserter;
	}

	@step("Wait for entidad response")
	public async waitForEntidadResponse(): Promise<PWResponse> {
		return this.page.waitForResponse((response) =>
			response.url().includes(ApiEndpoints.ENTIDAD),
		);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [ESPORTS_PAGE_ENDPOINT] },
		});
	}

	@step("Toggle sidebar section '{sectionName}' to {targetState}")
	private async toggleSidebarSection(
		sectionName: EsportsSidebarSection,
		targetState: ExpansionState,
	): Promise<void> {
		const header = this.map.sidebarSectionHeader(sectionName);
		const currentState = await header.getAttribute(
			Attributes.ARIA_EXPANDED,
		);
		const isExpanded = currentState === BooleanValueString.TRUE;
		const shouldExpand = targetState === ExpansionState.EXPANDED;

		if (isExpanded !== shouldExpand) {
			await header.click();
		} else {
			logger.info(
				`Sidebar section "${sectionName}" already ${targetState}`,
			);
		}
	}

	@step("Expand sidebar section: {sectionName}")
	public async expandSidebarSection(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.toggleSidebarSection(sectionName, ExpansionState.EXPANDED);
	}

	@step("Collapse sidebar section: {sectionName}")
	public async collapseSidebarSection(
		sectionName: EsportsSidebarSection,
	): Promise<void> {
		await this.toggleSidebarSection(sectionName, ExpansionState.COLLAPSED);
	}

	@step("Click sidebar section item: {sectionName} -> {itemName}")
	public async clickSidebarSectionItem(
		sectionName: EsportsSidebarSection,
		itemName: string,
	): Promise<void> {
		await this.expandSidebarSection(sectionName);
		await this.map.sidebarSectionItem(sectionName, itemName).click();
	}
}
