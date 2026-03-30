import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { CasinoGameName, GameProvider } from "@enums/casino-game";
import { TestUserRole } from "@enums/test-user-roles";
import { stripAuthFromExternalRequests } from "@core/utils/utils";
import { predefined } from "test-data/sources/predefined";

export class CasinoGameRakebackTestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Play casino game and verify instant rakeback reward")
	public async playCasinoGameAndVerifyRakeback(params: {
		gameName: CasinoGameName;
		gameProvider: GameProvider;
		userBeXp: number;
		houseEdge: number;
		betCount: number;
	}): Promise<void> {
		const { gameName, gameProvider, userBeXp, houseEdge, betCount } =
			params;

		const user = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				reuseContext: true,
				regularUserOptions: {
					emailVerified: true,
					startingXp: userBeXp,
				},
			},
		);

		await stripAuthFromExternalRequests(user.page);
		await user.pages.casinoPage.navigate();
		await user.pages.casinoGamesPage.steps().setupProviderAuthentication({
			gameName,
			gameProvider,
		});
		await user.pages.casinoPage
			.steps()
			.searchForGameAndOpenWithRetries(gameName);
		await user.pages.bookOfPyramidsPage
			.assertThat()
			.spinButtonIsDisplayed();
		await user.pages.bookOfPyramidsPage.steps().spinOnceAndGetResult();

		await user.pages.rewardsPage.navigate();
		await user.pages.rewardsPage
			.assertThat()
			.instantRakebackRewardIsCorrect(
				betCount,
				predefined.originalGames.rakebackPercentage,
				houseEdge,
			);
	}
}
