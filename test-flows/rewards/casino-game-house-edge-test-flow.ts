import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { CasinoGameName, GameProviderCode } from "@enums/casino-game";
import { TestUserRole } from "@enums/test-user-roles";

export class CasinoGameHouseEdgeTestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Get house edge value for casino game from admin panel")
	public async getHouseEdge(params: {
		casinoGameName: CasinoGameName;
		providerCode: GameProviderCode;
	}): Promise<number> {
		const { casinoGameName, providerCode } = params;

		const superAdmin = await this.browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);

		await superAdmin.pages.casinoGamesAdminPage.navigate();
		await superAdmin.pages.casinoGamesAdminPage.searchCasinoGameByName(
			casinoGameName,
		);

		return superAdmin.pages.casinoGamesAdminPage.getHouseEdgeValue(
			casinoGameName,
			providerCode,
		);
	}
}
