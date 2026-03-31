import {
	KOTH_DAILY_ENDPOINT,
	KOTH_ENDPOINT,
	KOTH_WEEKLY_ENDPOINT,
} from "@constants/page-endpoints";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { COINS_PER_USD } from "@core/handlers/user-balance-handler/user-balance-handler";
import { stripAuthFromExternalRequests } from "@core/utils/utils";
import { CasinoGameName, GameProviderCode } from "@enums/casino-game";
import { KothEventName } from "@enums/db/koth-event-types";
import { TestUserRole } from "@enums/test-user-roles";
import { calculateKothPoints } from "@formulas/koth";
import { BaseTestFlow, testFlow } from "@test-flows";
import { CasinoGameHouseEdgeTestFlow } from "@test-flows/rewards/casino-game-house-edge-test-flow";
import { OriginalsBetPlacementTestFlow } from "@test-flows/originals/originals-bet-placement-test-flow";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";

const kothTypeEndpointMap: Record<string, string> = {
	[KothEventName.DAILY]: KOTH_DAILY_ENDPOINT,
	[KothEventName.WEEKLY]: KOTH_WEEKLY_ENDPOINT,
	[KothEventName.MONTHLY]: KOTH_ENDPOINT,
};

const casinoGameProviderMap: Partial<Record<string, GameProviderCode>> = {
	[CasinoGameName.BOOK_OF_PYRAMIDS]: GameProviderCode.SOFTSWISS,
};

export class KothPointsCalculationTestFlow extends BaseTestFlow {
	constructor(
		private readonly browserSessionManager: BrowserSessionManager,
		private readonly casinoGameHouseEdgeFlow: CasinoGameHouseEdgeTestFlow,
		private readonly originalsBetFlow: OriginalsBetPlacementTestFlow,
	) {
		super();
	}

	@testFlow("Prepare user and get KoTH initial points")
	public async prepareUserAndGetKothInitialPoints(params: {
		kothType: string;
		game: string;
	}): Promise<{
		user: BrowserUserSession;
		kothEndpoint: string;
		initialPoints: number;
		dynamicHouseEdge: number | undefined;
	}> {
		const { kothType, game } = params;
		const kothEndpoint = kothTypeEndpointMap[kothType];
		const dynamicHouseEdge = await this.fetchDynamicHouseEdge(game);
		const user = await this.setupUser();
		const initialPoints = await user.pages.kothPage
			.steps()
			.navigateToKothEventAndGetPoints(kothEndpoint);

		return { user, kothEndpoint, initialPoints, dynamicHouseEdge };
	}

	@testFlow("Place bet and calculate expected KoTH points")
	public async placeBetAndCalculatePoints(params: {
		user: BrowserUserSession;
		game: string;
		betAmountInCoins: number;
		dynamicHouseEdge: number | undefined;
	}): Promise<{ actualBetInCoins: number; expectedPoints: number }> {
		const { user, game, betAmountInCoins, dynamicHouseEdge } = params;
		const actualBetInCoins = await this.placeBet(
			user,
			game,
			betAmountInCoins,
		);
		const expectedPoints = calculateKothPoints(
			actualBetInCoins,
			game,
			dynamicHouseEdge,
		);

		return { actualBetInCoins, expectedPoints };
	}

	@testFlow("Verify KoTH points increased correctly")
	public async verifyKothPointsIncreased(params: {
		user: BrowserUserSession;
		kothEndpoint: string;
		initialPoints: number;
		expectedPoints: number;
	}): Promise<void> {
		const { user, kothEndpoint, initialPoints, expectedPoints } = params;
		await user.pages.kothPage
			.steps()
			.navigateToKothEventAndVerifyPointsIncreasedBy(
				kothEndpoint,
				initialPoints,
				expectedPoints,
			);
	}

	private async fetchDynamicHouseEdge(
		game: string,
	): Promise<number | undefined> {
		const providerCode = casinoGameProviderMap[game];
		if (!providerCode) {
			return undefined;
		}

		return this.casinoGameHouseEdgeFlow.getHouseEdge({
			casinoGameName: game as CasinoGameName,
			providerCode: providerCode,
		});
	}

	private async setupUser(): Promise<BrowserUserSession> {
		return this.browserSessionManager.loginAs(TestUserRole.REGULAR, {
			regularUserOptions: {
				amount: SUPER_HIGH_USER_AMOUNT,
			},
		});
	}

	private async placeBet(
		user: BrowserUserSession,
		game: string,
		betAmountInCoins: number,
	): Promise<number> {
		if (this.originalsBetFlow.isOriginalGame(game)) {
			return this.originalsBetFlow.placeBet(user, game, betAmountInCoins);
		}

		return this.placeCasinoGameBet(user, game);
	}

	private async placeCasinoGameBet(
		user: BrowserUserSession,
		game: string,
	): Promise<number> {
		switch (game) {
			case CasinoGameName.BOOK_OF_PYRAMIDS: {
				await stripAuthFromExternalRequests(user.page);
				await user.pages.casinoPage.navigate();
				await user.pages.casinoPage
					.steps()
					.searchForGameAndOpen(CasinoGameName.BOOK_OF_PYRAMIDS);
				await user.pages.bookOfPyramidsPage.clickMaxBet();
				const betAmountInDollars =
					await user.pages.bookOfPyramidsPage.getBetAmount();
				await user.pages.bookOfPyramidsPage
					.steps()
					.spinOnceAndGetResult();
				return betAmountInDollars * COINS_PER_USD;
			}
			default:
				throw new Error(`Unsupported casino game: ${game}`);
		}
	}
}
