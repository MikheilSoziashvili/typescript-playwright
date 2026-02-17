import { BaseTestFlow, testFlow } from "@test-flows";
import {
	CryptoFlowDependencies,
	WithdrawalSetupResult,
} from "./types/crypto-flow-types";
import { TestUserRole } from "@enums/test-user-roles";
import { VipUserStatus } from "@enums/vip-user-statuses";

export class CryptoWithdrawalSetupTestFlow extends BaseTestFlow {
	constructor(private readonly deps: CryptoFlowDependencies) {
		super();
	}

	@testFlow("Setup user for crypto withdrawal")
	public async setupUser(params: {
		isVip: boolean;
	}): Promise<WithdrawalSetupResult> {
		const { isVip } = params;
		const {
			browserSessionManager,
			homePage,
			diceGamePage,
			userBalanceHandler,
			gamdomDb,
		} = this.deps;

		const superAdminSession = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
		);

		const userSession = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				reuseContext: true,
				regularUserOptions: { wagered: 100000 },
			},
		);

		if (isVip) {
			const user = userSession.getAuthenticatedUser().user;
			await gamdomDb.insertVipUser(
				user.userId,
				superAdminSession.getAuthenticatedUser().user.userId,
				VipUserStatus.BASIC_VIP,
			);
		}

		await homePage.navigateToWallet();

		await diceGamePage.navigate();
		await diceGamePage.rollDiceWithAmount(50);

		await homePage.navigate();
		const initialBalanceUSD =
			await userBalanceHandler.walletBalanceInFiatRounded();

		return {
			initialBalanceUSD: initialBalanceUSD,
			isVip: isVip,
		};
	}
}
