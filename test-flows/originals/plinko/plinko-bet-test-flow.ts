import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import { PlinkoUserSetupFlow } from "./plinko-user-setup-test-flow";
import { PlinkoBetExecutionFlow } from "./plinko-bet-execution-test-flow";
import { PlinkoBalanceVerificationFlow } from "./plinko-balance-verification-test-flow";
import { Unit } from "@enums/units";

export class PlinkoBetTestFlow extends BaseTestFlow {
	constructor(
		private readonly userSetupFlow: PlinkoUserSetupFlow,
		private readonly betExecutionFlow: PlinkoBetExecutionFlow,
		private readonly balanceVerificationFlow: PlinkoBalanceVerificationFlow,
	) {
		super();
	}

	@testFlow("Place Plinko bet and verify balance")
	public async placeBetAcrossWallets(params: {
		wallet: string;
		betCurrency: string;
		betAmount: number;
		walletUnits: Unit[];
		initialAmount: number;
	}): Promise<void> {
		const user = await this.userSetupFlow.prepareRegularUser({
			walletUnits: params.walletUnits,
			initialAmount: params.initialAmount,
		});

		const betResult = await this.betExecutionFlow.placeBet({
			user: user,
			wallet: params.wallet,
			betCurrency: params.betCurrency,
			betAmount: params.betAmount,
		});

		await this.balanceVerificationFlow.verifyBalance({
			user: user,
			walletUnit: betResult.walletUnit,
			betCurrency: betResult.betCurrency,
			betAmount: params.betAmount,
			coinsBefore: betResult.coinsBefore,
			winMultiplier: betResult.winMultiplier,
		});
	}
}
