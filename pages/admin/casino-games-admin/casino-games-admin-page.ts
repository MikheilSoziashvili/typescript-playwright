import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CasinoGamesAdminAsserter } from "./casino-games-admin-page-asserter";
import { CasinoGamesAdminMap } from "./casino-games-admin-page-map";
import { CasinoGamesAdminSteps } from "./casino-games-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { CASINO_GAMES_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { step } from "decorators/step";

export class CasinoGamesAdminPage extends BasePage<CasinoGamesAdminMap> {
	public constructor(page: Page) {
		super(page, new CasinoGamesAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CASINO_GAMES_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): CasinoGamesAdminAsserter {
		return new CasinoGamesAdminAsserter(this);
	}

	public steps(): CasinoGamesAdminSteps {
		return new CasinoGamesAdminSteps(this);
	}

	@step("Search casino game by name")
	public async searchCasinoGameByName(gameName: string): Promise<void> {
		await this.map.searchByNameOrCodeContainer.click();
		await this.map.searchByNameOrCodeInput.clear();
		await this.map.searchByNameOrCodeInput.pressSequentially(gameName);
	}

	@step("Get house edge value for casino game")
	public async getHouseEdgeValue(
		gameName: string,
		providerName: string,
	): Promise<number> {
		const value = await this.map
			.houseEdgeInputByCasinoGameAndProviderName(gameName, providerName)
			.inputValue();
		return Number(value);
	}
}
