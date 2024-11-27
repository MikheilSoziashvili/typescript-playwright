import { CASINO_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { CasinoPageMap } from "./casino-game-page-map";
import { CasinoPageAsserter } from "./casino-game-page-asserter";
import { CasinoPageSteps } from "./casino-game-page-step";

export class CasinoPage extends BasePage<CasinoPageMap> {
	public constructor(page: Page) {
		super(page, new CasinoPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CASINO_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): CasinoPageAsserter {
		return new CasinoPageAsserter(this);
	}

	public steps(): CasinoPageSteps {
		return new CasinoPageSteps(this);
	}

	public async clickProvidersDropdown(): Promise<void> {
		await this.map.providersDropdown.click();
	}

	public async clickSettingsButton(): Promise<void> {
		await this.map.settingsButton.click();
	}

	public async clickProvidersDropdownInSettingsModal(): Promise<void> {
		await this.map.providersDropdownInSettingsModal.click();
	}
}
