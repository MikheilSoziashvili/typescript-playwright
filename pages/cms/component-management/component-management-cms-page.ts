import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { ComponentManagementMap } from "./component-management-cms-page-map";
import { ComponentManagementAsserter } from "./component-management-cms-page-asserter";
import { ComponentManagementSteps } from "./component-management-cms-page-steps";
import {
	CMS_COMPONENT_MANAGEMENT_HOME_ENDPOINT,
	CMS_COMPONENT_MANAGEMENT_CASINO_ENDPOINT,
	CMS_COMPONENT_MANAGEMENT_SPORTS_ENDPOINT,
	CMS_COMPONENT_MANAGEMENT_PROVIDERS_ENDPOINT,
} from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";

export class ComponentManagementPage extends BasePage<ComponentManagementMap> {
	public constructor(page: Page) {
		super(page, new ComponentManagementMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_COMPONENT_MANAGEMENT_HOME_ENDPOINT] },
		});
	}

	@step("Navigate to casino component management page")
	public async navigateToCasino(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_COMPONENT_MANAGEMENT_CASINO_ENDPOINT] },
		});
	}

	@step("Navigate to sports component management page")
	public async navigateToSports(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_COMPONENT_MANAGEMENT_SPORTS_ENDPOINT] },
		});
	}

	@step("Navigate to providers component management page")
	public async navigateToProviders(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_COMPONENT_MANAGEMENT_PROVIDERS_ENDPOINT] },
		});
	}

	public override assertThat(): ComponentManagementAsserter {
		return new ComponentManagementAsserter(this);
	}

	public steps(): ComponentManagementSteps {
		return new ComponentManagementSteps(this);
	}
}
