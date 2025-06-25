import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { GeoblockedPageAsserter } from "./geoblocked-page-asserter";
import { GeoblockedPageMap } from "./geoblocked-page-map";
import { step } from "decorators/step";

export class GeoblockedPage extends BasePage<GeoblockedPageMap> {
	public constructor(page: Page) {
		super(page, new GeoblockedPageMap(page));
	}

	@step("Navigate to custom geoblocked page")
	public async navigateCustomGeoblockedPage(
		geoblockedPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [geoblockedPageEndpoint] },
		});
	}

	@step("Navigate to geoblocked page")
	public async navigateToPage(
		geoblockedPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [geoblockedPageEndpoint] },
		});
	}

	public override assertThat(): GeoblockedPageAsserter {
		return new GeoblockedPageAsserter(this);
	}

	@step("Open social media footer link by placeholder")
	public async openSocialMediaFooterLinkByPlaceholder(
		footerLink: string,
	): Promise<void> {
		await this.map.socialMediaFooterLinkByPlaceholder(footerLink).click();
	}
}
